"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/toast";

interface DeleteButtonProps {
	id: string;
	title: string;
	onSuccess?: () => void;
}

export const DeleteButton = ({ id, title, onSuccess }: DeleteButtonProps) => {
	const [open, setOpen] = useState(false);

	const { mutate, isPending } = useMutation({
		mutationFn: async () => {
			const res = await fetch(`/api/kevinadiwiguna/experience/${id}`, {
				method: "DELETE",
			});

			if (!res.ok) {
				throw new Error("Failed to delete experience");
			}

			return res.json();
		},
		onSuccess: () => {
			toast.add({
				title: "Experience deleted",
				description: "The experience has been deleted successfully.",
			});
			setOpen(false);
			onSuccess?.();
		},
	});

	return (
		<>
			<Button variant="ghost" size="icon" onClick={() => setOpen(true)} className="font-mono h-8 w-8 text-muted-foreground hover:text-destructive">
				<Trash2 className="h-4 w-4" />
				<span className="sr-only">Delete Experience</span>
			</Button>

			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogContent className={"font-mono"}>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Experience?</AlertDialogTitle>

						<AlertDialogDescription>
							This action cannot be undone.
							<br />
							<br />
							The experience <span className="font-medium text-foreground">&quot;{title}&quot;`</span> will be permanently deleted.
						</AlertDialogDescription>
					</AlertDialogHeader>

					<AlertDialogFooter className="font-mono">
						<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>

						<AlertDialogAction
							onClick={(e) => {
								e.preventDefault();
								mutate();
							}}
							disabled={isPending}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Deleting...
								</>
							) : (
								"Delete"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};
