


function createCard(user){
    const card = document.createElement("div");
    card.className = "col-md-4 mb-3";
    card.innerHTML = `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">${user.name}</h5>
        <p class="card-text">${user.email}</p>
        <p class="card-text">${user.company.name}</p>
        <p class="card-text">${user.address.city}</p>
        
      </div>
    </div>
  `;
  return card;
}

async function getUsers() {
    const spinner = document.getElementById('loading');
    const container = document.getElementById('users-container')

    try {
         if (spinner) spinner.style.display = 'block';
        
        const response = await fetch('https://jsonplaceholder.typicode.com/users'); 
         
        

        if (!response.ok) {
      throw new Error(`error!: ${response.status}`);
        }
        const users = await response.json();

        container.innerHTML = "";

        users.forEach(user => {
            const card = createCard(user);
            container.appendChild(card);
        });
        } catch (error) {
        container.innerHTML = `<div class="alert alert-danger">Failed to load users: ${error.message}</div>`;
    } finally {
        spinner.style.display = "none";
    }
        



   

    
} 
getUsers();