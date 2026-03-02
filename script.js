const music = document.getElementById("bg-music");
let playing = false;

// mật khẩu mở quà
const PASS_CODE = "1607";
let passValue = "";
const passDots = document.getElementById("passDots");
const passError = document.getElementById("passError");
const passBox = document.getElementById("passBox");
const mainContainer = document.querySelector(".container");

// Ẩn toàn bộ nội dung chính cho tới khi nhập đúng mật khẩu
if (mainContainer) {
    mainContainer.style.display = "none";
}

function renderPassDots() {
    if (!passDots) return;
    Array.from(passDots.children).forEach((dot, idx) => {
        dot.classList.toggle("filled", idx < passValue.length);
    });
}

function handlePassSuccess() {
    if (passBox) {
        passBox.classList.remove("show");
    }
    if (mainContainer) {
        mainContainer.style.display = "block";
    }
    const nameBox = document.getElementById("nameBox");
    if (nameBox) {
        nameBox.classList.add("show");
    }
}

function resetPass(withError = false) {
    if (withError && passError) {
        passError.textContent = "Sai mật khẩu rồi, thử lại nha 💔";
    } else if (passError) {
        passError.textContent = "";
    }
    passValue = "";
    renderPassDots();
}

// gắn sự kiện cho keypad mật khẩu
document.querySelectorAll(".pass-key").forEach(btn => {
    btn.addEventListener("click", () => {
        if (passValue.length >= 4) return;
        passValue += btn.dataset.num || "";
        renderPassDots();
        if (passValue.length === 4) {
            if (passValue === PASS_CODE) {
                resetPass(false);
                handlePassSuccess();
            } else {
                if (passBox) passBox.classList.add("shake");
                setTimeout(() => passBox && passBox.classList.remove("shake"), 400);
                resetPass(true);
            }
        }
    });
});

const passDelBtn = document.querySelector(".pass-del");
if (passDelBtn) {
    passDelBtn.addEventListener("click", () => {
        if (!passValue.length) return;
        passValue = passValue.slice(0, -1);
        renderPassDots();
    });
}

// danh sách bài hát (đổi tên cho khớp với file thật của bạn)
// hiện tại thư mục chỉ có "Tell Ur Mom II.mp3"
const playlist = [
    "Tell Ur Mom II.mp3",
    "Giờ Thì.mp3",
    "NƠI NÀY CÓ ANH.mp3",
    "Shhh.mp3",
    "Thích Quá Rùi Nà.mp3",
    "Pefect.mp3",
];

// ảnh cover tương ứng: 2,5,7,8,1,4
const coverImages = [
    "2.jpg",
    "5.jpg",
    "7.jpg",
    "8.jpg",
    "1.jpg",
    "4.jpg",
];
let currentTrack = 0;

// hàm load bài hiện tại
function loadCurrentTrack(autoPlay = false) {
    if (!playlist.length) return;
    music.src = playlist[currentTrack];
    music.load();

     // cập nhật giao diện music player
    const titleEl = document.getElementById("currentTrackTitle");
    const coverEl = document.getElementById("musicCover");
    if (titleEl) {
        titleEl.textContent = playlist[currentTrack].replace(/\.mp3$/i, "");
    }
    if (coverEl && coverImages[currentTrack]) {
        coverEl.src = coverImages[currentTrack];
    }
    if (autoPlay) {
        music.play();
        playing = true;
    }
}

// khi phát xong 1 bài thì tự chuyển bài tiếp theo
music.addEventListener("ended", () => {
    if (!playlist.length) return;
    currentTrack = (currentTrack + 1) % playlist.length;
    loadCurrentTrack(true);
});

let receiver = "";

// lưu tên
function saveName() {
    receiver = document.getElementById("receiverName").value || "Em";
    document.getElementById("nameText").innerText = receiver;
    document.getElementById("nameBox").classList.remove("show");
}

// nội dung thư + hiệu ứng gõ chữ
const letterElement = document.getElementById("letterContent");
const fullLetterText = 
`Anh chúc bé luôn luôn vui vẻ, hạnh phúc tràn đầy năng lượng và gặp nhiều may mắn, 
bỏ qua những điều làm em buồn, làm em không vui, cười nhiều hơn là khóc ngheee. 
Mong chúng ta sẽ ở bên cạnh nhau thật bền vững và lâu dài emm nhé. 🌸
\n\nAnh vẫn mãi là chỗ dựa vững chắc cho em tin tưởng ahihi <333
\nChúc béee có một ngày 8/3 thật hạnh phúc 💗`;

let letterIndex = 0;
let letterTyping = null;
let letterRainInterval = null;

function startLetterTyping() {
    if (!letterElement) return;
    // reset
    letterElement.textContent = "";
    letterIndex = 0;
    if (letterTyping) {
        clearInterval(letterTyping);
        letterTyping = null;
    }

    letterTyping = setInterval(() => {
        if (letterIndex >= fullLetterText.length) {
            clearInterval(letterTyping);
            letterTyping = null;
            return;
        }
        letterElement.textContent += fullLetterText.charAt(letterIndex);
        letterIndex++;
    }, 40);
}

// MUSIC: popup player kiểu card
document.getElementById("btn-music").onclick = () => {
    if (!playlist.length) return;
    const box = document.getElementById("musicBox");
    const list = document.getElementById("songList");

    // build playlist nếu chưa có
    if (list && !list.children.length) {
        playlist.forEach((name, index) => {
            const item = document.createElement("div");
            item.className = "music-item";
            item.textContent = name.replace(/\.mp3$/i, "");
            item.onclick = () => {
                currentTrack = index;
                highlightPlaylist();
                loadCurrentTrack(true);
                updatePlayPauseIcon(true);
            };
            list.appendChild(item);
        });
    }

    highlightPlaylist();
    box.classList.add("show");
};

function closeMusic() {
    document.getElementById("musicBox").classList.remove("show");
}

// cập nhật active trong playlist
function highlightPlaylist() {
    const list = document.getElementById("songList");
    if (!list) return;
    Array.from(list.children).forEach((el, idx) => {
        el.classList.toggle("active", idx === currentTrack);
    });
}

// nút prev/next/play
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const btnPlayPause = document.getElementById("btnPlayPause");

function updatePlayPauseIcon(isPlaying) {
    if (!btnPlayPause) return;
    btnPlayPause.textContent = isPlaying ? "⏸" : "▶";
}

if (btnPrev && btnNext && btnPlayPause) {
    btnPrev.onclick = () => {
        currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
        highlightPlaylist();
        loadCurrentTrack(true);
        updatePlayPauseIcon(true);
    };

    btnNext.onclick = () => {
        currentTrack = (currentTrack + 1) % playlist.length;
        highlightPlaylist();
        loadCurrentTrack(true);
        updatePlayPauseIcon(true);
    };

    btnPlayPause.onclick = () => {
        // nếu chưa load bài nào thì load bài hiện tại
        if (!music.src) {
            loadCurrentTrack(true);
            playing = true;
            updatePlayPauseIcon(true);
            return;
        }

        if (playing) {
            music.pause();
        } else {
            music.play();
        }
        playing = !playing;
        updatePlayPauseIcon(playing);
    };
}

// cập nhật progress bar
music.addEventListener("timeupdate", () => {
    const bar = document.getElementById("musicProgressBar");
    if (!bar || !music.duration) return;
    const percent = (music.currentTime / music.duration) * 100;
    bar.style.width = `${percent}%`;
});

// LETTER
document.getElementById("btn-letter").onclick = () => {
    const box = document.getElementById("letterBox");
    box.classList.add("show");
    startLetterTyping();

    // icon rơi phía sau popup letter
    if (!letterRainInterval) {
        const icons = ["🌸", "💌", "💖", "✨"];
        letterRainInterval = setInterval(() => {
            const el = document.createElement("div");
            el.className = "letter-fall";
            el.textContent = icons[Math.floor(Math.random() * icons.length)];
            el.style.left = Math.random() * 100 + "vw";
            el.style.animationDuration = 4 + Math.random() * 3 + "s";
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 9000);
        }, 500);
    }
};

function closeLetter() {
    document.getElementById("letterBox").classList.remove("show");

    if (letterRainInterval) {
        clearInterval(letterRainInterval);
        letterRainInterval = null;
    }
}

// IMAGE gallery popup
document.getElementById("btn-image").onclick = () => {
    const box = document.getElementById("imageBox");
    box.classList.add("show");

    // gắn sự kiện click cho từng thumbnail (chỉ làm 1 lần)
    const rows = box.querySelectorAll(".image-row img");
    const preview = document.getElementById("previewImage");
    rows.forEach(img => {
        if (img.dataset.bound) return;
        img.dataset.bound = "true";
        img.addEventListener("click", () => {
            if (preview) {
                preview.src = img.src;
            }
        });
    });
};

function closeImage() {
    document.getElementById("imageBox").classList.remove("show");
}

// GIFT: mở khung scene lãng mạn + hoa/ảnh rơi
let giftRainInterval = null;

document.getElementById("btn-gift").onclick = () => {
    const box = document.getElementById("giftBox");
    box.classList.add("show");

    // bắt đầu tạo hiệu ứng khi bấm gift nếu chưa chạy
    if (!giftRainInterval) {
        const frame = box.querySelector(".gift-frame");
        const icons = ["🌸", "💌", "💖", "✨"];

        giftRainInterval = setInterval(() => {
            const el = document.createElement("div");
            el.className = "gift-fall";
            // chỉ dùng icon nhỏ, không dùng ảnh nữa để nền hoa hồng sạch hơn
            el.textContent = icons[Math.floor(Math.random() * icons.length)];

            // rơi ngẫu nhiên trong khung
            el.style.left = Math.random() * 90 + "%";
            el.style.fontSize = 12 + Math.random() * 8 + "px";
            el.style.animationDuration = 5 + Math.random() * 3 + "s";

            frame.appendChild(el);
            setTimeout(() => el.remove(), 9000);
        }, 400);
    }
};

function closeGift() {
    const box = document.getElementById("giftBox");
    box.classList.remove("show");

    // dừng hoa rơi và xóa bớt
    if (giftRainInterval) {
        clearInterval(giftRainInterval);
        giftRainInterval = null;
    }
}

// sao đêm tĩnh lấp lánh
for (let i = 0; i < 80; i++) {
    const s = document.createElement("div");
    s.className = "star";
    s.style.left = Math.random() * 100 + "vw";
    s.style.top = Math.random() * 100 + "vh";
    s.style.animationDelay = Math.random() * 5 + "s";
    document.body.appendChild(s);
}

// tim rơi
setInterval(() => {
    const h = document.createElement("div");
    h.className = "heart";
    h.innerHTML = "❤️";
    h.style.left = Math.random() * 100 + "vw";
    h.style.animationDuration = Math.random() * 3 + 2 + "s";
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 5000);
}, 300);

// icon 🌸 💌 💖 ✨ rơi trên nền ngoài
setInterval(() => {
    const icons = ["🌸", "💌", "💖", "✨"];
    const el = document.createElement("div");
    el.className = "bg-icon";
    el.textContent = icons[Math.floor(Math.random() * icons.length)];
    el.style.left = Math.random() * 100 + "vw";
    el.style.animationDuration = 5 + Math.random() * 4 + "s";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 10000);
}, 600);
