import { BaseSyntheticEvent, useEffect, useRef, useState } from "react";
import { Button, CloseButton, Container, Form, ListGroup, OverlayTrigger, Popover, Stack } from "react-bootstrap";

type ServerTask = {
  id: string,
  name: string;
  completed: boolean;
  user: string;
};

type FetchState = 'Loading' | 'Error' | 'Ok'


type NewTask = Omit<ServerTask, 'id'>

export const App = () => {
  const [isTaskEnd, setTaskEnd] = useState(false);
  const [tasks, setTasks] = useState<ServerTask[]>([]);
  const [fetchState, setFetchState] = useState<FetchState>('Loading')
  const [inputError, setInputError] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const inputNotEmpty = (
    <Popover>
      <Popover.Body>
        Not Empty
      </Popover.Body>
    </Popover>
  )

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/tasks/')
      .then(res => res.json())
      .then(data => {
        setTasks(data)
        setFetchState('Ok')
       })
      .catch(err => {
        setFetchState('Error')
        console.log(err)
      })
  }, [])

  function handleAddTask(e: BaseSyntheticEvent) {
    e.preventDefault();
    if (!inputRef.current || inputRef.current.value === '') {
      if(inputRef.current) inputRef?.current.focus()
      setInputError(true)
      return
    }
    setInputError(false)
    const formData = new FormData(e.target);
    const name = formData.get("name") as string;
    const user = formData.get("user") as string;

    const newTask: NewTask = {
      name,
      completed: false,
      user
    };

    fetch('http://localhost:8000/api/v1/tasks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(newTask)
    }).then(response => response.json()).then(data => setTasks([...tasks, data]))

    inputRef.current.value = ''
    inputRef.current.focus()
  }

  function handleEndTask(id: string) {
    const editedTasks = tasks.map(task => task.id === id ? {...task, completed: !task.completed} : task)
    setTasks(editedTasks);
  }

  function handleDeleteTask(id: string) {
    const deletedTask = tasks.filter(task => task.id !== id)
    fetch(`http://localhost:8000/api/v1/tasks/${id}/`, {
      method: 'DELETE'
    }).then((response) => {
      if (response.ok) {
        setTasks(deletedTask)
      } else throw new Error(response.statusText)
    })
      .catch(console.log)
  }

  return (
    <Container>
      {fetchState === 'Loading' && '...Loading'}
      {fetchState === 'Error' && 'Some error, try again leter'}
      {fetchState === 'Ok' && (<Stack className="col-md-5 mx-auto">
        <Form onSubmit={handleAddTask}>
          <Form.Group className="mb-3">
            <Form.Label>Task creator</Form.Label>
            <Form.Control ref={inputRef} autoFocus={true} type="text" name="name" placeholder="new task..." />
            <Form.Text className="text-muted">Enter your task</Form.Text>
          </Form.Group>
          <OverlayTrigger show={inputError} placement="right" overlay={inputNotEmpty}>
            <Button variant="primary" type="submit">Add task</Button>
          </OverlayTrigger>
        </Form>
        <ListGroup>
          {tasks.map((task) => {
            let fontStyle = {
              color: task.completed ? "red" : "blue",
            };
            return (
              <ListGroup.Item key={task.id} role="button" className="d-flex justify-content-between">
                <span onClick={() => handleEndTask(task.id)} style={fontStyle}>
                  {task.name}
                </span>
                <CloseButton className="border-danger" onClick={() => handleDeleteTask(task.id)} />
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </Stack>)}
    </Container>
  );
};
