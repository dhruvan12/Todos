import React, { useState } from 'react'
import { useTodo } from '../context/index';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';

function TodoForm() {
    const [todo, setTodo] = useState("")
    const { addTodo } = useTodo()

    const add = (e) => {
        e.preventDefault()

        if (!todo.trim()) return

        addTodo({ todo: todo.trim(), completed: false })
        setTodo("")
    }

    return (
        <form onSubmit={add} className="flex gap-2">
            <Input
                type="text"
                placeholder="What needs to be done?"
                className="flex-1 h-11 bg-neutral-900/80 border-neutral-700/50 focus:border-neutral-600 text-white placeholder:text-neutral-500"
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
            />
            <Button 
                type="submit" 
                variant="success" 
                size="lg"
                className="h-11 px-5 gap-2 font-medium"
            >
                <Plus className="w-4 h-4" />
                Add Task
            </Button>
        </form>
    );
}

export default TodoForm;