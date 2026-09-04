import { Buffer } from "node:buffer"
import { readFile } from "node:fs/promises"
import path from "node:path"

import { transform, transformStyleAttribute } from "lightningcss"
import postcss from "postcss"

const atRuleCache = new Map()
const selectorCache = new Map()

function canonicalAtRule(name, params) {
  const cacheKey = `${name}\0${params}`
  if (atRuleCache.has(cacheKey)) return atRuleCache.get(cacheKey)
  const body = name.endsWith("keyframes")
    ? "to{opacity:1}"
    : ".__surfacekit_context__{--surfacekit-context:0}"
  let canonical = [name.toLowerCase(), params.trim().replace(/\s+/g, " ")]
  try {
    const css = minifyCssToFixedPoint(`@${name} ${params}{${body}}`)
    const root = postcss.parse(css)
    const atRule = root.first
    if (atRule?.type === "atrule") canonical = [atRule.name, atRule.params]
  } catch {
    // Unknown at-rules still receive deterministic whitespace normalization.
  }
  atRuleCache.set(cacheKey, canonical)
  return canonical
}

function atRuleContext(rule) {
  const context = []
  let parent = rule.parent
  while (parent) {
    if (parent.type === "atrule") {
      context.unshift(canonicalAtRule(parent.name, parent.params))
    }
    parent = parent.parent
  }
  return JSON.stringify(context)
}

function canonicalSelector(selector) {
  if (selectorCache.has(selector)) return selectorCache.get(selector)
  let canonical = selector
  try {
    const css = minifyCssToFixedPoint(`${selector}{--surfacekit-selector:0}`)
    const rule = postcss.parse(css).first
    if (rule?.type === "rule") canonical = rule.selector
  } catch {
    canonical = selector.trim().replace(/\s+/g, " ")
  }
  selectorCache.set(selector, canonical)
  return canonical
}

function minifyStyleToFixedPoint(style) {
  let result = style
  for (let pass = 0; pass < 4; pass += 1) {
    const next = transformStyleAttribute({
      code: Buffer.from(result),
      minify: true,
    }).code.toString()
    if (next === result) return result
    result = next
  }
  return result
}

function minifyCssToFixedPoint(css) {
  let result = css
  for (let pass = 0; pass < 4; pass += 1) {
    const next = transform({
      filename: "surfacekit-canonical.css",
      code: Buffer.from(result),
      minify: true,
    }).code.toString()
    if (next === result) return result
    result = next
  }
  return result
}

function canonicalValue(value) {
  return minifyStyleToFixedPoint(`--surfacekit-value:${value}`).slice(
    "--surfacekit-value:".length
  )
}

function splitVarArguments(value) {
  let depth = 0
  let quote = ""
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index]
    if (quote) {
      if (character === "\\") index += 1
      else if (character === quote) quote = ""
    } else if (character === '"' || character === "'") quote = character
    else if (character === "(") depth += 1
    else if (character === ")") depth -= 1
    else if (character === "," && depth === 0) {
      return [value.slice(0, index).trim(), value.slice(index + 1).trim()]
    }
  }
  return [value.trim()]
}

function findClosingParenthesis(value, start) {
  let depth = 1
  let quote = ""
  for (let index = start; index < value.length; index += 1) {
    const character = value[index]
    if (quote) {
      if (character === "\\") index += 1
      else if (character === quote) quote = ""
    } else if (character === '"' || character === "'") quote = character
    else if (character === "(") depth += 1
    else if (character === ")" && --depth === 0) return index
  }
  return -1
}

function normalizeKnownVarFallbacks(value, packageVariables) {
  let result = ""
  let cursor = 0
  while (cursor < value.length) {
    const start = value.indexOf("var(", cursor)
    if (start < 0) return result + value.slice(cursor)
    const end = findClosingParenthesis(value, start + 4)
    if (end < 0) return result + value.slice(cursor)
    const [property, fallback] = splitVarArguments(value.slice(start + 4, end))
    const normalizedFallback = fallback
      ? normalizeKnownVarFallbacks(fallback, packageVariables)
      : undefined
    const fallbackMatches =
      normalizedFallback &&
      packageVariables.get(property)?.has(canonicalValue(normalizedFallback))
    const normalizedVar = fallbackMatches
      ? `var(${property})`
      : `var(${property}${normalizedFallback ? `,${normalizedFallback}` : ""})`
    result += value.slice(cursor, start) + normalizedVar
    cursor = end + 1
  }
  return result
}

function canonicalDeclarations(rule, packageVariables) {
  if (rule.type === "atrule" && rule.name === "property") {
    const canonicalAtRule = postcss.parse(
      minifyCssToFixedPoint(rule.toString())
    ).first
    return declarationMapFromNodes(canonicalAtRule.nodes ?? [])
  }
  const declarations = (rule.nodes ?? [])
    .filter((node) => node.type === "decl")
    .map(
      ({ prop, value, important }) =>
        `${prop}:${normalizeKnownVarFallbacks(value, packageVariables)}${important ? "!important" : ""}`
    )
    .join(";")
  const canonical = minifyStyleToFixedPoint(declarations)
  if (!canonical) return new Map()
  const wrapper = postcss.parse(
    `.__surfacekit_declarations__{${canonical}}`
  ).first
  return declarationMapFromNodes(wrapper.nodes)
}

function declarationMapFromNodes(nodes) {
  const declarationMap = new Map()
  for (const { prop, value, important } of nodes) {
    const values = declarationMap.get(prop) ?? []
    values.push([value, Boolean(important)])
    declarationMap.set(prop, values)
  }
  return declarationMap
}

function sameValues(a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

function sameDeclarations(a, b) {
  return (
    a.size === b.size &&
    [...a].every(([property, values]) => sameValues(b.get(property), values))
  )
}

function packageDeclarationsCover(packageDeclarations, appDeclarations) {
  return [...appDeclarations].every(([property, values]) =>
    sameValues(packageDeclarations.get(property), values)
  )
}

function nodesWithoutOwnedDeclarations(rule, ownedProperties) {
  if (ownedProperties.size === 0) return rule.nodes.map((node) => node.clone())

  // LightningCSS may fold several source longhands into one canonical
  // shorthand. Rebuild the remaining declaration block from that canonical
  // representation so removal uses the same property groups as comparison.
  // An empty variable map keeps app-owned fallback values intact.
  const canonical = canonicalDeclarations(rule, new Map())
  const remaining = new Map(
    [...canonical].filter(([property]) => !ownedProperties.has(property))
  )
  const retainedSourceDeclarations = rule.nodes.filter((node) => {
    if (node.type !== "decl") return false
    const singleDeclarationRule = rule.clone({ nodes: [node.clone()] })
    return [
      ...canonicalDeclarations(singleDeclarationRule, new Map()).keys(),
    ].some((property) => remaining.has(property))
  })
  const retainedCanonical = canonicalDeclarations(
    rule.clone({
      nodes: retainedSourceDeclarations.map((node) => node.clone()),
    }),
    new Map()
  )

  if (sameDeclarations(retainedCanonical, remaining)) {
    const retained = new Set(retainedSourceDeclarations)
    return rule.nodes.flatMap((node) =>
      node.type !== "decl" || retained.has(node) ? node.clone() : []
    )
  }

  const remainingDeclarations = []
  for (const [property, values] of remaining) {
    for (const [value, important] of values) {
      remainingDeclarations.push(
        postcss.decl({ prop: property, value, important })
      )
    }
  }

  let declarationsInserted = false
  return rule.nodes.flatMap((node) => {
    if (node.type !== "decl") return node.clone()
    if (declarationsInserted) return []
    declarationsInserted = true
    return remainingDeclarations
  })
}

function addSelectorGroup(selectorGroups, selector, nodes) {
  const groupKey = JSON.stringify(nodes.map((node) => node.toString()))
  const group = selectorGroups.get(groupKey) ?? { nodes, selectors: [] }
  group.selectors.push(selector)
  selectorGroups.set(groupKey, group)
}

function selectorKey(rule, selector) {
  return JSON.stringify([atRuleContext(rule), canonicalSelector(selector)])
}

function atRuleKey(atRule) {
  return JSON.stringify([
    atRuleContext(atRule),
    canonicalAtRule(atRule.name, atRule.params),
  ])
}

export function dedupeSurfaceKitCss({ packageCssPath, referenceCssPath }) {
  return {
    postcssPlugin: "dedupe-surfacekit-css",
    async Once(root) {
      if (
        !root.source?.input.file ||
        path.resolve(root.source.input.file) !== path.resolve(referenceCssPath)
      ) {
        return
      }

      const packageRoot = postcss.parse(await readFile(packageCssPath, "utf8"))
      const packageRules = new Map()
      const packageVariables = new Map()
      const packageAtRules = new Map()
      const packageAtRuleIdentities = new Set()

      packageRoot.walkDecls(/^--/, ({ prop, value }) => {
        const values = packageVariables.get(prop) ?? new Set()
        values.add(canonicalValue(value))
        packageVariables.set(prop, values)
      })

      packageRoot.walkRules((rule) => {
        const declarations = canonicalDeclarations(rule, packageVariables)
        for (const selector of rule.selectors) {
          const key = selectorKey(rule, selector)
          const declarationSets = packageRules.get(key) ?? []
          declarationSets.push(declarations)
          packageRules.set(key, declarationSets)
        }
      })
      packageRoot.walkAtRules((atRule) => {
        const key = atRuleKey(atRule)
        packageAtRuleIdentities.add(key)
        if (
          !atRule.nodes ||
          atRule.nodes.every(
            (node) => node.type === "decl" || node.type === "comment"
          )
        ) {
          const declarationSets = packageAtRules.get(key) ?? []
          declarationSets.push(canonicalDeclarations(atRule, packageVariables))
          packageAtRules.set(key, declarationSets)
        }
      })

      root.walkRules((rule) => {
        const declarations = canonicalDeclarations(rule, packageVariables)
        const selectorGroups = new Map()

        for (const selector of rule.selectors) {
          const packageDeclarationSets = packageRules.get(
            selectorKey(rule, selector)
          )
          if (!packageDeclarationSets) {
            addSelectorGroup(
              selectorGroups,
              selector,
              rule.nodes.map((node) => node.clone())
            )
            continue
          }
          const ownedProperties = new Set()
          let hasConflict = false
          for (const [property, values] of declarations) {
            if (
              packageDeclarationSets.some((packageDeclarations) =>
                sameValues(packageDeclarations.get(property), values)
              )
            ) {
              ownedProperties.add(property)
            } else if (
              packageDeclarationSets.some((packageDeclarations) =>
                packageDeclarations.has(property)
              )
            ) {
              hasConflict = true
            }
          }
          if (hasConflict) {
            throw rule.error(
              `Conflicting SurfaceKit CSS selector ${selector} in the same at-rule context`
            )
          }
          const remainingNodes = nodesWithoutOwnedDeclarations(
            rule,
            ownedProperties
          )
          if (remainingNodes.length === 0) continue
          addSelectorGroup(selectorGroups, selector, remainingNodes)
        }

        if (selectorGroups.size === 0) {
          rule.remove()
          return
        }
        const replacements = [...selectorGroups.values()].map(
          ({ nodes, selectors }) =>
            rule.clone({ selector: selectors.join(","), nodes })
        )
        rule.replaceWith(...replacements)
      })

      root.walkAtRules((atRule) => {
        if (
          atRule.nodes &&
          !atRule.nodes.every(
            (node) => node.type === "decl" || node.type === "comment"
          )
        ) {
          return
        }
        const packageDeclarationSets = packageAtRules.get(atRuleKey(atRule))
        if (!packageDeclarationSets) return
        const declarations = canonicalDeclarations(atRule, packageVariables)
        if (
          !packageDeclarationSets.some((packageDeclarations) =>
            packageDeclarationsCover(packageDeclarations, declarations)
          )
        ) {
          throw atRule.error(
            `Conflicting SurfaceKit CSS at-rule @${atRule.name} ${atRule.params}`
          )
        }
        atRule.remove()
      })

      const atRules = []
      root.walkAtRules((atRule) => atRules.push(atRule))
      for (const atRule of atRules.reverse()) {
        if (
          atRule.nodes?.length === 0 &&
          packageAtRuleIdentities.has(atRuleKey(atRule))
        ) {
          atRule.remove()
        }
      }
    },
  }
}

dedupeSurfaceKitCss.postcss = true

export default dedupeSurfaceKitCss
