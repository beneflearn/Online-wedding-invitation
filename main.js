const allSections = document.querySelector('#all-sections');
const navbar = document.querySelector('nav');
const muteButton = document.querySelector('.mute-bottom');
let audio;
const links = document.querySelectorAll('.circle');

function main() {
    allSections.style.display = 'none';
    navbar.style.opacity = 0;
    muteButton.style.display = 'none';
}

main();


document.querySelector('#welcome-btn').onclick = function () {
    if (allSections.style.display == 'none') {
        allSections.style.display = 'block';
        navbar.style.opacity = 1;
        muteButton.style.display = 'block';
        audio = document.createElement('audio');
        audio.src = 'assets/audio/birds.mp3';
        audio.autoplay = true;
        audio.loop = true;
        AOS.refresh();
    }
}

muteButton.onclick = function () {
    if (audio.muted == false) {
        audio.muted = true;
    } else {
        audio.muted = false;
    }
}

// Monitor perubahan scroll untuk mengatur tampilan link active
const sections = Array.from(links).map(link => {
    const id = link.getAttribute('href').slice(1);
    return document.getElementById(id);
});

window.onscroll = function() {
    let current = null;

    // Tentukan bagian halaman yang terlihat
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100; // Offset untuk akurasi
        const sectionBottom = sectionTop + section.offsetHeight;
        const scrollPosition = window.scrollY;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            current = section.id;
        }
    });

    // Perbarui kelas active berdasarkan bagian halaman
    links.forEach(link => {
        const id = link.getAttribute('href').slice(1);
        if (id === current) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
};

// COUNTDOWN

// Set tanggal acara
var eventDate = new Date("Jan 25, 2025 08:00:00").getTime();

// Update countdown setiap 1 detik
var countdown = setInterval(function() {

    // Ambil tanggal saat ini
    var now = new Date().getTime();

    // Hitung jarak waktu antara sekarang dan tanggal acara
    var timeLeft = eventDate - now;

    // Hitung hari, jam, menit, dan detik
    var days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    var hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // Tampilkan hasil countdown pada elemen dengan ID yang sesuai
    document.getElementById("days").innerHTML = days.toString().padStart(2, '0');
    document.getElementById("hours").innerHTML = hours.toString().padStart(2, '0');
    document.getElementById("minutes").innerHTML = minutes.toString().padStart(2, '0');
    document.getElementById("seconds").innerHTML = seconds.toString().padStart(2, '0');

    // Jika countdown selesai
    if (timeLeft < 0) {
        clearInterval(countdown);
        document.getElementById("days").innerHTML = "00";
        document.getElementById("hours").innerHTML = "00";
        document.getElementById("minutes").innerHTML = "00";
        document.getElementById("seconds").innerHTML = "00";
    }
}, 1000);

// Google Script
const webAppUrl = 'https://sheetdb.io/api/v1/dh0obe4iet69t';

// Mengambil data dari google sheet
function fetchSheetData() {
    fetch(webAppUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            document.querySelector('#messages').innerHTML = data.map((row) => {
                return `
                <div class="w-100 bg-white p-3 rounded mb-2" data-aos="fade-up" data-aos-duration="1000"
                data-aos-delay="200">
                    <div class="d-flex justify-content-between">
                        <h6>${row.name}</h6>
                        <h6>${row.confirmation}</h6>
                    </div>
                    <p class="text-secondary">${row.comment}</p>
                 </div>`
            }).join('');
        })
        .catch(error => {
            console.log('Terjadi Kesalahan saat memuat data', error);
        });
}

// Mengirim data ke Google Sheet
document.querySelector('form').onsubmit = function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    data.submit_time = new Date().toLocaleString('ID-id');

    fetch(webAppUrl, {
        method: 'POST',
        body: JSON.stringify({data}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                alert('Terjadi kesalahan saat mengirim pesan');
            }
            return response.text();
        })
        .then(result => {
            alert('Pesan berhasil dikirim!');
            fetchSheetData(); // Refresh data setelah mengirim
        })
        .catch(error => {
            console.error('Terjadi kesalahan saat memuat data', error);
        });
};

fetchSheetData();