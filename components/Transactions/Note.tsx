import React, { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { Transaction } from "../../contracts";
import { saveNote } from "../../utils/firebaseQueries";
import debounce from 'lodash/debounce'
import Button from "../Button";
import { PencilIcon } from "@heroicons/react/solid";

const Note = ({ txn }: { txn: Transaction }) => {
	const [editingToggle, setEditingToggle] = React.useState(false);
	const [note, setNote] = React.useState(txn.message);
	const textRef = useRef<HTMLTextAreaElement | null>(null);
	const [loading, setLoading] = React.useState(false);

	const handleSaveNote = debounce(async (e) => {
		try {
			setLoading(true);
			await saveNote(txn.id, e.target.value);
			toast.success("Note saved successfully");
			setEditingToggle(false);
		} catch (error) {
			console.error(error);
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	}, 500);

	// useEffect(() => {
	// 	if (editingToggle && textRef.current) {
	// 		textRef.current.focus();
	// 	}
	// }, [editingToggle]);

	return (
		<div className="sm:ml-2 rounded-md">
			<div className="flex items-center">
				{!editingToggle && (
					<PencilIcon className="w-5 h-5 mr-2" />
				)}
				<textarea
					ref={textRef}
					value={note}
					placeholder="Add note"
					className={`w-3/5 rounded-md border-none border-transparent outline-none -mx-2 p-2 ${
						editingToggle
							? "bg-white resize-y"
							: "bg-transparent cursor-pointer resize-none"
					}`}
					onBlur={() => setEditingToggle(false)}
					onFocus={() => setEditingToggle(true)}
					rows={1}
					onChange={(e) => {
						setNote(e.target.value);
						handleSaveNote(e)
					}}
				/>
			</div>
		</div>
	);
};

export default Note;
