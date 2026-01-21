import { useEffect, useState } from "react"
import { TodoProvider } from "./context"
import { TodoForm } from "./components"
import TodoItem from "./components/Todoitems"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./components/ui/card"
import { Badge } from "./components/ui/badge"
import { CheckCircle2, ListTodo, Sparkles } from "lucide-react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"

function App() {
  const [todos, setTodo] = useState([])
  const [activeId, setActiveId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveId(null)

    if (over && active.id !== over.id) {
      setTodo((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  const activeTodo = activeId ? todos.find((t) => t.id === activeId) : null

  const addTodo = (todo) => {
    setTodo((prev) => [{ id: Date.now(), ...todo }, ...prev])
  }

  const updateTodo = (id, todo) => {
    setTodo((prev) => prev.map((prevTodo) => (prevTodo.id === id ? todo : prevTodo)))
  }

  const deletetodo = (id) => {
    setTodo((prev) => prev.filter((todo) => todo.id !== id))
  }

  const toggleComplete = (id) => {
    setTodo((prev) => prev.map((prevTodo) => prevTodo.id === id ? { ...prevTodo, completed: !prevTodo.completed } : prevTodo))
  }

  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem("todos"))
    if (todos && todos.length > 0) {
      setTodo(todos)
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos]);

  const completedCount = todos.filter(t => t.completed).length
  const pendingCount = todos.length - completedCount

  return (
    <TodoProvider value={{ todos, addTodo, updateTodo, deletetodo, toggleComplete }}>
      <div className="min-h-screen bg-black">
        {/* Gradient background effect */}
        <div className="fixed inset-0 bg-gradient-to-br from-neutral-950 via-black to-neutral-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800/20 via-transparent to-transparent"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-white/5 to-transparent blur-3xl"></div>
        </div>
        
        <div className="relative z-10 px-4 py-12 sm:py-16">
          <div className="w-full max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-5">
              <h2 className="text-neutral-400 text-xl">
                Stay organized. Get things done.
              </h2>
            </div>

            {/* Stats */}
            {todos.length > 0 && (
              <div className="flex items-center justify-center gap-4 mb-8">
                <Badge variant="secondary" className="gap-1.5 py-1 px-3">
                  <ListTodo className="w-3.5 h-3.5" />
                  {pendingCount} pending
                </Badge>
                <Badge variant="success" className="gap-1.5 py-1 px-3">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {completedCount} completed
                </Badge>
              </div>
            )}

            {/* Main Card */}
            <Card className="border-neutral-800/80 bg-neutral-900/30 backdrop-blur-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Add New Task</CardTitle>
                <CardDescription>What do you need to accomplish today?</CardDescription>
              </CardHeader>
              <CardContent>
                <TodoForm />
              </CardContent>
            </Card>

            {/* Todo List */}
            <div className="mt-6 space-y-3">
              {todos.length === 0 ? (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-800/50 border border-neutral-700/50 mb-4">
                    <ListTodo className="w-7 h-7 text-neutral-500" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-300 mb-2">No tasks yet</h3>
                  <p className="text-neutral-500 text-sm">Add your first task to get started</p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragCancel={handleDragCancel}
                >
                  <SortableContext
                    items={todos.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {todos.map((todo) => (
                      <TodoItem key={todo.id} todo={todo} />
                    ))}
                  </SortableContext>
                  <DragOverlay>
                    {activeTodo ? (
                      <TodoItem todo={activeTodo} isDragOverlay />
                    ) : null}
                  </DragOverlay>
                </DndContext>
              )}
            </div>

            {/* Footer */}
            <div className="mt-12 text-center">
              <p className="text-neutral-600 text-xs">
                Drag tasks to reorder • Press Enter to add
              </p>
            </div>
          </div>
        </div>
      </div>
    </TodoProvider>
  )
}

export default App
