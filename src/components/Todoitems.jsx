import React, { useState } from 'react';
import { useTodo } from '../context';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Pencil, Check, Trash2, GripVertical } from 'lucide-react';
import { cn } from '../lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function TodoItem({ todo, isDragOverlay = false }) {
    const [isTodoEditable, setIsTodoEditable] = useState(false)
    const [todoMsg, setTodoMsg] = useState(todo.todo)
    const { updateTodo, deletetodo, toggleComplete } = useTodo()

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: todo.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const editTodo = () => {
        if (todoMsg.trim()) {
            updateTodo(todo.id, { ...todo, todo: todoMsg.trim() })
        }
        setIsTodoEditable(false)
    }

    const toggleCompleted = () => {
        toggleComplete(todo.id)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            editTodo()
        }
        if (e.key === 'Escape') {
            setTodoMsg(todo.todo)
            setIsTodoEditable(false)
        }
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200",
                todo.completed
                    ? "border-neutral-800/50 bg-neutral-900/20"
                    : "border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900/70 hover:border-neutral-700",
                isDragging && "opacity-50 scale-[1.02] shadow-xl shadow-black/50 border-neutral-600 z-50",
                isDragOverlay && "shadow-2xl shadow-black/80 border-neutral-500 bg-neutral-800/90 scale-105"
            )}
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className={cn(
                    "opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing touch-none",
                    isDragOverlay && "opacity-100"
                )}
            >
                <GripVertical className="w-4 h-4 text-neutral-500 hover:text-neutral-300" />
            </div>

            {/* Checkbox */}
            <Checkbox
                checked={todo.completed}
                onCheckedChange={toggleCompleted}
                className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
            />

            {/* Todo Text */}
            {isTodoEditable ? (
                <Input
                    type="text"
                    className="flex-1 h-8 bg-neutral-800 border-neutral-600 text-white text-sm"
                    value={todoMsg}
                    onChange={(e) => setTodoMsg(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
            ) : (
                <span
                    className={cn(
                        "flex-1 text-sm transition-all",
                        todo.completed
                            ? "line-through text-neutral-500"
                            : "text-neutral-200"
                    )}
                    onDoubleClick={() => !todo.completed && setIsTodoEditable(true)}
                >
                    {todoMsg}
                </span>
            )}

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Edit/Save Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "h-8 w-8 text-neutral-400 hover:text-white",
                        isTodoEditable && "text-emerald-400 hover:text-emerald-300"
                    )}
                    onClick={() => {
                        if (todo.completed) return;
                        if (isTodoEditable) {
                            editTodo();
                        } else {
                            setIsTodoEditable(true);
                        }
                    }}
                    disabled={todo.completed}
                >
                    {isTodoEditable ? (
                        <Check className="w-4 h-4" />
                    ) : (
                        <Pencil className="w-4 h-4" />
                    )}
                </Button>

                {/* Delete Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-neutral-400 hover:text-red-400 hover:bg-red-500/10"
                    onClick={() => deletetodo(todo.id)}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}

export default TodoItem;