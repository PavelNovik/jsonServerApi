const tBody = document.querySelector('.table__body');
const input = document.querySelector('input');
const select = document.querySelector('.selectLaptop');
let filterUser = '';
let filterLaptop = '';
const form = document.querySelector('.form');
const addUserBtn = document.querySelector('.adduser__menu');
const closeBtn = document.querySelector('.close');
const container = document.querySelector('.container');
const modalWindow = document.querySelector('.overlay');
const formBtn = document.querySelector('.form__btn');

const formName = document.querySelector('.name');
const formAge = document.querySelector('.age');
const formLaptop = document.querySelector('.laptop');
const formGenderMan = document.querySelector('.man');
const formGenderWoman = document.querySelector('.woman');
const currentUserId = document.querySelector('.userId');

function resetForm() {
  formName.value = '';
  formAge.value = '';
  formGenderMan.checked = false;
  formGenderWoman.checked = false;
  formLaptop.value = '';
  currentUserId.value = '';
  container.classList.toggle('blur');
  modalWindow.classList.toggle('hide');
}

addUserBtn.addEventListener('click', function () {
  container.classList.toggle('blur');
  modalWindow.classList.toggle('hide');
  formBtn.textContent = 'Add User';
});
closeBtn.addEventListener('click', function () {
  //   container.classList.toggle('blur');
  //   modalWindow.classList.toggle('hide');
  resetForm();
});

// console.log(form.elements);

const getUsers = function () {
  tBody.innerHTML = '';
  fetch(
    `http://localhost:8080/users?${
      filterUser ? 'name_like=' + filterUser : ''
    }&${filterLaptop ? 'laptop_like=' + filterLaptop : ''}`
  )
    .then((res) => res.json())
    .then((res) => {
      res.forEach((item) => {
        tBody.innerHTML += `
           <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.age}</td>
                <td>${item.gender}</td>
                <td>${item.laptop}</td>
                <td>
                <button data-id='${item.id}' class="del__user">Delete</button>
                <button data-id='${item.id}' class="change__user">Change</button>
                </td>
            </tr>
           `;
      });
      const delBtns = document.querySelectorAll('.del__user');
      const changeBtns = document.querySelectorAll('.change__user');

      //   console.log(delBtns);
      //   console.log(Array.from(delBtns));

      delBtns.forEach((btn) =>
        btn.addEventListener('click', function (e) {
          //   console.log(e.target.dataset.id, 'delete');
          fetch(`http://localhost:8080/users/${e.target.dataset.id}`, {
            method: 'DELETE',
          })
            .then(() => getUsers())
            .catch((err) => console.error(err));
        })
      );
      changeBtns.forEach((btn) =>
        btn.addEventListener('click', function (e) {
          //   console.log(e.target.dataset.id, 'change');
          //   console.log(btn.dataset.id, 'change');
          fetch(`http://localhost:8080/users/${btn.dataset.id}`)
            .then((res) => res.json())
            .then((res) => {
              container.classList.toggle('blur');
              modalWindow.classList.toggle('hide');
              formBtn.textContent = 'Change User';
              formName.value = res.name;
              formAge.value = res.age;
              formLaptop.value = res.laptop;
              currentUserId.value = res.id;
              res.gender === 'man'
                ? (formGenderMan.checked = true)
                : (formGenderWoman.checked = true);
              //   console.log(res);
            })
            .catch((err) => console.error(err));
        })
      );
    });
};

getUsers();

input.addEventListener('input', function (e) {
  filterUser = input.value;
  getUsers();
});
select.addEventListener('change', function (e) {
  filterLaptop = select.value;
  getUsers();
});

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const user = {
    name: e.target[0].value,
    age: e.target[1].value,
    gender: e.target[2].checked ? e.target[2].value : e.target[3].value,
    laptop: e.target[4].value.toLowerCase(),
  };

  //   function resetForm() {
  //     e.target[0].value = '';
  //     e.target[1].value = '';
  //     e.target[2].checked = false;
  //     e.target[3].checked = false;
  //     e.target[4].value = '';
  //   }

  if (formBtn.textContent === 'Add User') {
    fetch('http://localhost:8080/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then((resp) => {
        resetForm();
        getUsers();
      })
      .catch((err) => console.error('Error', err));
  } else {
    fetch(`http://localhost:8080/users/${currentUserId.value}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then((resp) => {
        resetForm();
        getUsers();
      })
      .catch((err) => console.error('Error', err));
  }

  //   console.log(user);
  //   container.classList.toggle('blur');
  //   modalWindow.classList.toggle('hide');
});
