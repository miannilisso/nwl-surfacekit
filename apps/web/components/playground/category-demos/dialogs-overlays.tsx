"use client"

import * as React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@nwl/surfacekit/components/alert-dialog"
import { Button } from "@nwl/surfacekit/components/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@nwl/surfacekit/components/command"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@nwl/surfacekit/components/context-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@nwl/surfacekit/components/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@nwl/surfacekit/components/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@nwl/surfacekit/components/dropdown-menu"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@nwl/surfacekit/components/hover-card"
import { Input } from "@nwl/surfacekit/components/input"
import { Label } from "@nwl/surfacekit/components/label"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@nwl/surfacekit/components/popover"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@nwl/surfacekit/components/sheet"
import { Toaster, createToastManager } from "@nwl/surfacekit/components/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@nwl/surfacekit/components/tooltip"

export function AlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive" />}>
        Delete workspace
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Acme?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently deletes the workspace and its audit history.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function CommandDemo() {
  return (
    <div className="w-full max-w-md rounded-2xl border">
      <Command label="Search commands">
        <CommandInput placeholder="Search commands..." />
        <CommandList>
          <CommandEmpty>No commands found.</CommandEmpty>
          <CommandGroup heading="Workspace">
            <CommandItem value="open settings">
              Open settings<CommandShortcut>⌘,</CommandShortcut>
            </CommandItem>
            <CommandItem value="invite member">
              Invite member<CommandShortcut>⌘I</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Navigation">
            <CommandItem value="view audit log">View audit log</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}

export function ContextMenuDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger
        render={
          <div
            tabIndex={0}
            className="grid h-36 w-full place-items-center rounded-2xl border border-dashed text-sm text-muted-foreground"
          />
        }
      >
        Right-click this workspace
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Open</ContextMenuItem>
        <ContextMenuItem disabled>Export</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked>Autosave</ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup value="team">
          <ContextMenuRadioItem value="personal">Personal</ContextMenuRadioItem>
          <ContextMenuRadioItem value="team">Team</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>Share</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Email link</ContextMenuItem>
            <ContextMenuItem>Copy link</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Edit profile
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profile settings</DialogTitle>
          <DialogDescription>Update account details.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="dialog-display-name">Display name</Label>
          <Input id="dialog-display-name" defaultValue="Amina N." />
        </div>
        <DialogFooter showCloseButton>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function DrawerDemo() {
  return (
    <Drawer showSwipeHandle>
      <DrawerTrigger render={<Button variant="outline" />}>
        Open drawer
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Audit filters</DrawerTitle>
          <DrawerDescription>
            Refine events shown in the audit log.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose render={<Button />}>Apply filters</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export function DropdownMenuDemo() {
  const [status, setStatus] = React.useState("No action selected")
  return (
    <div className="grid gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Workspace actions
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setStatus("Workspace opened")}>
            Open
          </DropdownMenuItem>
          <DropdownMenuItem disabled>Export</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>Autosave</DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value="team">
            <DropdownMenuRadioItem value="personal">
              Personal
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="team">Team</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Share</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Email</DropdownMenuItem>
              <DropdownMenuItem>Copy link</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
      <p aria-live="polite" className="text-sm text-muted-foreground">
        {status}
      </p>
    </div>
  )
}

export function HoverCardDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger
        delay={0}
        closeDelay={0}
        render={
          <a
            href="#platform-owner"
            className="font-medium underline underline-offset-4"
          />
        }
      >
        Platform owner
      </HoverCardTrigger>
      <HoverCardContent>
        <strong className="block">Amina N.</strong>
        <span className="text-muted-foreground">
          Owns production access reviews and release policy.
        </span>
      </HoverCardContent>
    </HoverCard>
  )
}

export function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>
        Open filters
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Audit filters</PopoverTitle>
          <PopoverDescription>
            Refine events shown in the audit log.
          </PopoverDescription>
        </PopoverHeader>
        <Button size="sm">Apply filters</Button>
      </PopoverContent>
    </Popover>
  )
}

export function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>
        Open settings
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Workspace settings</SheetTitle>
          <SheetDescription>
            Manage policy and membership defaults.
          </SheetDescription>
        </SheetHeader>
        <div className="p-6 text-sm">Production workspace settings.</div>
        <SheetFooter>
          <Button>Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function ToastDemo() {
  const [manager] = React.useState(() => createToastManager())
  return (
    <>
      <Button
        onClick={() =>
          manager.add({
            title: "Changes saved",
            description: "Your workspace configuration is live.",
            type: "success",
            timeout: 0,
          })
        }
      >
        Show notification
      </Button>
      <Toaster toastManager={manager} limit={3} />
    </>
  )
}

export function TooltipDemo() {
  return (
    <TooltipProvider delay={0}>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>
          Deploy
        </TooltipTrigger>
        <TooltipContent side="top">
          Deploy the approved release to production
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
