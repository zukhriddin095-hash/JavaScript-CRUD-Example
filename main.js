const usersRow = document.querySelector('.users__rows')
const countUsers = document.querySelector('.count-users')
const pageCount = document.querySelector('.pageCount')
const previousBtn = document.querySelector('.Previous')
const nextBtn = document.querySelector('.Next')

let LIMIT = 10
let currentPage = 1
let totalPages = 1

let ENDPOINT = 'https://68cbe078716562cf50756e54.mockapi.io/Users'

const axiosInstance = axios.create({
	baseURL: ENDPOINT,
	timeout: 10000,
})

//  Foydalanuvchilar sonini olish va pagination yaratish
async function getDataCount() {
	try {
		let { data } = await axiosInstance()
		let dataCount = data.length
		countUsers.textContent = `Count users: ${dataCount}`

		totalPages = Math.ceil(dataCount / LIMIT)
		renderPagination()
	} catch (error) {
		console.error('Xato:', error)
	}
}

//  Paginationni chizish
function renderPagination() {
	pageCount.innerHTML = ''
	for (let i = 1; i <= totalPages; i++) {
		pageCount.innerHTML += `
      <li class="page-item ${currentPage === i ? 'active' : ''}">
        <a class="page-link" href="#" onclick="getPages(${i})">${i}</a>
      </li>`
	}
}

//  Foydalanuvchilarni chiqarish
async function getUsers() {
	usersRow.innerHTML = `
    <div class="d-flex justify-content-center align-items-center" style="width:100%;  height: 50vh;">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `

	try {
		let { data } = await axiosInstance(`?page=${currentPage}&limit=${LIMIT}`)
		usersRow.innerHTML = ''
		data.forEach(user => {
			usersRow.innerHTML += getCardUsers(user)
		})
	} catch (error) {
		console.error('Xato:', error)
	}
}

//  Sahifa almashtirish
function getPages(i) {
	currentPage = i
	getUsers()
	renderPagination()
}

//  Previous
function pagePrevious() {
	if (currentPage > 1) {
		currentPage--
		getUsers()
		renderPagination()
	}
}

//  Next
function pageNext() {
	if (currentPage < totalPages) {
		currentPage++
		getUsers()
		renderPagination()
	}
}

//  Eventlar
previousBtn.addEventListener('click', e => {
	e.preventDefault()
	pagePrevious()
})

nextBtn.addEventListener('click', e => {
	e.preventDefault()
	pageNext()
})

//  User card
function getCardUsers({ avatar, birthday, id, married, name, title }) {
	return `
  
	<div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div class="card h-100">
        <img  src="${
					avatar ||
					'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-image-icon-default-avatar-profile-icon-social-media-user-vector-image-209162840.jpg'
				}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${name}</h5>
          <p class="card-text">${title}</p>
					<p class="card-text">${birthday}</p>
           <button  
					onclick='editUser(${id})'
				 	type="button" 
					class="btn btn-primary ms-3"
				  data-bs-toggle="modal" 
        	data-bs-target="#exampleModal">
          <i class="fa-solid fa-pen-to-square"></i> Edit
        </button>

        <button onclick='deleteUser(${id})' type="button" class="btn btn-danger ms-5" data-bs-toggle="modal" data-bs-target="#deleteModal">
          <i class="fa-solid fa-trash"></i> Delete
        </button>
        </div>`
}

getDataCount()
getUsers()

// CRUD
const form = document.getElementById('form-data')
const myModal = document.getElementById('exampleModal')
let selected = ''

form.addEventListener('submit', async e => {
	e.preventDefault()

	const formData = new FormData(form)
	const values = Object.fromEntries(formData.entries())

	await handleSubmit(values)

	const modal = bootstrap.Modal.getInstance(
		document.getElementById('exampleModal')
	)
	modal.hide()
})

// edit user
async function editUser(id) {
	let formName = document.getElementById('form-name')
	let formTitle = document.getElementById('form-title')
	try {
		selected = id
		let { data } = await axiosInstance(`/${id}`)
		console.log(selected, data)
		formName.value = data.name
		formTitle.value = data.title
	} catch (error) {
		console.log(error.response.message)
	} finally {
		console.log(selected, 'hello world')
	}
}
// edit user

// handle submit

async function handleSubmit(value) {
	try {
		if (selected === '') {
			await axiosInstance.post('/', value)
			console.log(value)
		} else {
			await axiosInstance.put(`/${selected}`, value)
		}
		getDataCount()
		getUsers()

		selected = ''
	} catch (error) {
		console.error(error?.response ?? error)
	} finally {
	}
}

// handle submit

// modal close
myModal.addEventListener('hidden.bs.modal', () => {
	form.reset()
})
// modal close

// delete user function

async function deleteUser(id) {
	alert('Are you sure you want to delete this user?')
	try {
		await axiosInstance(`/${id}`, {
			method: 'DELETE',
		})
		getUsers()
		getDataCount()
	} catch (error) {
		console.log(error.message)
	}
}

// save Edit

// loading BTN
