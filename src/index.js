let addToy = false;
let toys = {};

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  document
    .querySelector(".add-toy-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log(e.target);
      const newToy = {};
      newToy.name = e.target.name.value;
      newToy.image = `${e.target.image.value}`;
      newToy.likes = 0;
      newToy.id = `${toys.length + 1}`;

      await fetch("http://localhost:3000/toys", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: `${newToy}`,
      });
      createCard(newToy);
    });

  fetch("http://localhost:3000/toys", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach((toy) => {
        createCard(toy);
      });
      toys = data;
    });
});

const createCard = (toy) => {
  let card = document.createElement("div");
  card.className = "card";

  let name = document.createElement("h2");
  name.textContent = toy.name;
  card.appendChild(name);

  let img = document.createElement("img");
  img.src = toy.image;
  img.className = "toy-avatar";
  card.appendChild(img);

  let likes = document.createElement("p");
  likes.innerText = `Likes: ${toy.likes}`;
  let likesNum = toy.likes;

  let button = document.createElement("button");
  button.className = "like-btn";
  button.id = toy.id;
  button.innerText = "Like ❤️";

  button.addEventListener("click", (e) => {
    console.log(e.target);
    e.preventDefault();
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        likes: `${parseInt(likesNum) + 1}`,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        likes.innerText = `Likes: ${data.likes}`;
        toys = data;
      });
  });
  card.appendChild(likes);
  card.appendChild(button);

  document.querySelector("#toy-collection").appendChild(card);
  console.log(toy);
};
