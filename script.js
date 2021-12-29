const addForm = document.querySelector('.form-add')
const editForm = document.querySelector('.form-edit')
const taskContainer = document.querySelector('.task-container')
const taskInput = document.getElementById('add-task')
const editInput = document.getElementById('edit-task')
const editButton = editForm.querySelector('button[type="submit"]')

// Initial state variables
let id
let taskStore = [
  // Sample data
  // {
  //   id: 1,
  //   value: 'Watch parks and rec',
  //   date: '2021-04-10T14:43:26.374Z',
  // },
]
let taskToBeEditedID

// Get the saved tasks on page load
getLocalStorage()

// Create a task and display it on UI
addForm.addEventListener('submit', e => {
  e.preventDefault()
  // Take the input value and store in a variable
  const inputValue = taskInput.value
  // Check if user has entered something
  if (inputValue === '') return alert('Please, Enter a valid task.....')
  // Check what the id of last added task and add 1 and if there's no task set the id as 1
  id = taskStore.at(-1)?.id ? taskStore.at(-1).id + 1 : 1
  // Push the object of task to taskStore
  taskStore.push({id: id, value: inputValue, date: new Date()})
  id++
  // Display the tasks on UI
  displayTasks(taskStore)
  // Store the taskStore in local storage
  setLocalStorage(taskStore)
  // Clear the inputs
  taskInput.value = ''
})

// Edit the task and re-render the UI
editForm.addEventListener('submit', e => {
  e.preventDefault()
  // Get the task that needs to be edited
  const task = taskStore.find(task => task.id === taskToBeEditedID)
  // Set the value of task as the edited one
  task.value = editInput.value
  // Display tasks to UI
  displayTasks(taskStore)
  // Save the tasks to local storage
  setLocalStorage(taskStore)
  // Clear the Input field
  editInput.value = ''
  editInput.disabled = true
  editButton.disabled = true
})

// Function that takes an array and display html
function displayTasks(arr) {
  // Clear the exisiting sample html
  taskContainer.innerHTML = ''
  // Loop over the array of tasks and create a html template
  arr.forEach(task => {
    const html = `
      <li id="${task.id}">
        <p>
          ${task.value}
          <span>${formatDate(new Date(task.date))}</span>
        </p>
        <div class="task-actions">
          <Button class="btn-edit">Edit</Button>
          <Button class="btn-delete">Delete</Button>
        </div>
      </li>
    `
    // Insert the html in the element
    taskContainer.insertAdjacentHTML('afterbegin', html)

    // Attatch the event listeners to buttons
    const deleteBtns = document.querySelectorAll('.btn-delete')
    const editBtns = document.querySelectorAll('.btn-edit')
    const checkTask = document.querySelectorAll('input[type="checkbox"]')
    deleteBtns.forEach(btn => btn.addEventListener('click', deleteTask))
    editBtns.forEach(btn => btn.addEventListener('click', editTask))
  })
}

// Function that saves the taskStore to local storage
function setLocalStorage(arr) {
  localStorage.setItem('tasks', JSON.stringify(arr))
}

// Function that takes from local storage and display it on UI
function getLocalStorage() {
  // Get the parsed data from local storage
  const data = JSON.parse(localStorage.getItem('tasks'))
  // if no tasks return
  if (!data) return (taskContainer.innerHTML = '<p>No Tasks Available!</p>')
  // Set the taskStore as data
  taskStore = data
  // Display the tasks to UI
  displayTasks(taskStore)
}

// Function that resets local storage
function resetLocalStoarge() {
  // if no tasks reset the storage and display the html
  if (!taskStore.length) {
    localStorage.removeItem('tasks')
    taskContainer.innerHTML = '<p>No Tasks Available!</p>'
  }
}

// Function that deletes the tasks
function deleteTask(e) {
  // Get the task element that is to be deleted
  const taskToBeDeletedEl = e.target.closest('li')
  // Get the index of the task
  const taskIndex = taskStore.findIndex(
    task => task.id === +taskToBeDeletedEl.id,
  )
  // Remove the task from the task store
  taskStore.splice(taskIndex, 1)
  // Set the local storage
  setLocalStorage(taskStore)
  // Display the tasks to UI
  displayTasks(taskStore)
  // Reset local storage if no tasks
  resetLocalStoarge()
}

// Function that edits the tasks
function editTask(e) {
  // Get the task element to be edited
  const taskToBeEditedEl = e.target.closest('li')
  // Get the task value from task store
  const taskToBeEdited = taskStore.find(
    task => task.id === +taskToBeEditedEl.id,
  )
  // Enable edit input and button
  editInput.disabled = false
  editButton.disabled = false
  // Set the input value of edit as the task value
  editInput.value = taskToBeEdited.value
  editInput.focus()
  taskToBeEditedID = taskToBeEdited.id
  return taskToBeEditedID
}

// Function that calculates milliseconds  between two dates
function calcDaysPassed(date1, date2) {
  return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24))
}

// Function that format date according to time passed
function formatDate(date, locale) {
  // 1. Count how many days have passed between now and passed date
  const daysPassed = calcDaysPassed(new Date(), date)
  // 2. Print text according to how many days have passed
  if (daysPassed === 0) return 'Today'
  if (daysPassed === 1) return 'Yesterday'
  if (daysPassed <= 7) return `${daysPassed} days ago`
  // 3. if above statememnts are false then this will be calculated and returned
  return new Intl.DateTimeFormat(navigator.language, {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    weekday: 'long',
  }).format(date)
}
