const tableBody = document.querySelector('#table-body');
const form = document.querySelector('#dog-form');

let dogs = [];

// Render a list of already registered dogs in the table
function renderDog(dog) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${dog.name}</td>
    <td>${dog.breed}</td>
    <td>${dog.sex}</td>
    <td><button data-id="${dog.id}">Edit</button></td>
  `;
  tableBody.appendChild(tr);
}

// Make a dog editable
function editDog(dog) {
  form.name.value = dog.name;
  form.breed.value = dog.breed;
  form.sex.value = dog.sex;
  form.dataset.id = dog.id;
}

// Handle form submission to update dog information
function handleSubmit(e) {
  e.preventDefault();
  const id = form.dataset.id;
  const name = form.name.value;
  const breed = form.breed.value;
  const sex = form.sex.value;

  // Update dog information with PATCH request
  fetch(`http://localhost:3000/dogs/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, breed, sex })
  })
    .then(res => res.json())
    .then(updatedDog => {
      // Reflect the updated dog information in the table
      const dogIndex = dogs.findIndex(dog => dog.id === updatedDog.id);
      dogs[dogIndex] = updatedDog;
      tableBody.innerHTML = '';
      dogs.forEach(renderDog);
      form.reset();
    });
}

// Initialize the app
function init() {
  // Fetch dogs from server and render them in the table
  fetch('http://localhost:3000/dogs')
    .then(res => res.json())
    .then(dogsData => {
      dogs = dogsData;
      dogs.forEach(renderDog);
    });

  // Handle edit button click to populate the form
  tableBody.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {
      const id = e.target.dataset.id;
      const dog = dogs.find(dog => dog.id === id);
      editDog(dog);
    }
  });

  // Handle form submission to update dog information
  form.addEventListener('submit', handleSubmit);
}

init();
