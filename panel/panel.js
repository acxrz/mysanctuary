function showSection(sectionId) {
    const sections = document.querySelectorAll(".panel-section");
    sections.forEach(section => section.classList.add("hidden"));

    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.remove("hidden");
    }
}

let currentPage = 0;
const itemsPerPage = 6;

function addMemory() {
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const description = prompt("Enter a description for this memory:") || "No description provided.";
            const memoryData = {
                image: event.target.result,
                date: new Date().toLocaleDateString(),
                description: description
            };

            saveMemory(memoryData);
            displayMemories();
        };
        reader.readAsDataURL(file);
    }
}

function saveMemory(memoryData) {
    let memories = JSON.parse(localStorage.getItem("memories")) || [];
    memories.push(memoryData);
    localStorage.setItem("memories", JSON.stringify(memories));
}

function displayMemories() {
    const memoryGallery = document.getElementById('memoryGallery');
    memoryGallery.innerHTML = "";

    let memories = JSON.parse(localStorage.getItem("memories")) || [];
    let totalPages = Math.ceil(memories.length / itemsPerPage);
    let start = currentPage * itemsPerPage;
    let end = start + itemsPerPage;
    let paginatedMemories = memories.slice(start, end);

    paginatedMemories.forEach((memory, index) => {
        const memoryDiv = document.createElement('div');
        memoryDiv.classList.add('memory-item');

        const img = document.createElement('img');
        img.src = memory.image;

        const dateParagraph = document.createElement('p');
        dateParagraph.classList.add('memory-date');
        dateParagraph.textContent = `Added on: ${memory.date}`;

        const descriptionParagraph = document.createElement('p');
        descriptionParagraph.classList.add('memory-description');

        if (memory.description.length > 50) {
            descriptionParagraph.innerHTML = `${memory.description.substring(0, 50)}... <span class="see-more" onclick="showPopup(${start + index})">See More</span>`;
        } else {
            descriptionParagraph.textContent = memory.description;
        }

        memoryDiv.addEventListener('click', function () {
            showPopup(start + index);
        });

        memoryDiv.appendChild(img);
        memoryDiv.appendChild(dateParagraph);
        memoryDiv.appendChild(descriptionParagraph);
        memoryGallery.appendChild(memoryDiv);
    });

    // Show/hide pagination buttons
    document.getElementById('prevPage').style.display = currentPage > 0 ? "inline-block" : "none";
    document.getElementById('nextPage').style.display = currentPage < totalPages - 1 ? "inline-block" : "none";
}

function changePage(direction) {
    let memories = JSON.parse(localStorage.getItem("memories")) || [];
    let totalPages = Math.ceil(memories.length / itemsPerPage);

    currentPage += direction;
    if (currentPage < 0) currentPage = 0;
    if (currentPage >= totalPages) currentPage = totalPages - 1;

    displayMemories();
}

function showPopup(index) {
    const memories = JSON.parse(localStorage.getItem("memories")) || [];
    const memory = memories[index];

    const popupOverlay = document.getElementById('popupOverlay');
    const popupImage = document.getElementById('popupImage');
    const popupDescription = document.getElementById('popupDescription');

    popupImage.src = memory.image;
    popupDescription.innerHTML = `<div class="popup-text">${memory.description}</div>`;
    popupOverlay.classList.remove('hidden');

    document.getElementById('editDescription').onclick = function () {
        let newDescription = prompt("Edit the description:", memory.description);
        if (newDescription !== null) {
            memories[index].description = newDescription;
            localStorage.setItem("memories", JSON.stringify(memories));
            displayMemories();
            popupOverlay.classList.add('hidden');
        }
    };

    document.getElementById('deleteMemory').onclick = function () {
        document.getElementById('popupOverlay').classList.add('hidden');
        document.getElementById('confirmOverlay').classList.remove('hidden');

        document.getElementById('confirmDelete').onclick = function () {
            memories.splice(index, 1);
            localStorage.setItem("memories", JSON.stringify(memories));
            displayMemories();
            document.getElementById('confirmOverlay').classList.add('hidden');
        };

        document.getElementById('cancelDelete').onclick = function () {
            document.getElementById('confirmOverlay').classList.add('hidden');
        };
    };

    document.getElementById('closePopup').onclick = function () {
        popupOverlay.classList.add('hidden');
    };
}

document.addEventListener("DOMContentLoaded", function() {
    const music = document.getElementById("backgroundMusic");

    const playPromise = music.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(() => {

            document.addEventListener("click", () => {
                music.play();
            }, { once: true });
        });
    }
});

function filterLetters(tag) {
    let letters = document.querySelectorAll('.letter-box');

    letters.forEach(letter => {
        if (tag === 'all' || letter.dataset.tag === tag) {
            letter.style.display = "block";
        } else {
            letter.style.display = "none";
        }
    });
}

function resizeImage(imgSrc, callback) {
    const img = new Image();
    img.src = imgSrc;
    img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = 391;
        canvas.height = 300;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        callback(canvas.toDataURL("image/jpeg"));
    };
}


function updateSlideshow() {
    document.querySelectorAll(".slide img").forEach((img) => {
        resizeImage(img.src, (resizedSrc) => {
            img.src = resizedSrc;
        });
    });
}

window.onload = updateSlideshow;


window.onload = function () {
    displayMemories();
};
