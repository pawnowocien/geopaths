"use strict";
const container = document.getElementById('notifications-container');
function showNotification(message, isHtml = false) {
    const notification = document.createElement('div');
    notification.className =
        'relative border-1 bg-black text-white w-60 px-4 py-3 rounded-xl shadow-lg transition-opacity duration-1500 opacity-0 select-none';
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.className = 'absolute top-2 right-3 text-white text-lg leading-none hover:text-neon-blue focus:outline-none hover:cursor-pointer';
    closeBtn.onclick = () => {
        notification.remove();
    };
    const messageText = document.createElement('div');
    if (isHtml) {
        messageText.innerHTML = message;
    }
    else {
        messageText.textContent = message;
    }
    notification.appendChild(closeBtn);
    notification.appendChild(messageText);
    if (container === null) {
        return;
    }
    container.appendChild(notification);
    requestAnimationFrame(() => {
        notification.classList.remove('opacity-0');
        notification.classList.add('opacity-100');
    });
    setTimeout(() => {
        notification.classList.remove('opacity-100');
        notification.classList.add('opacity-0');
    }, 9000);
    setTimeout(() => {
        notification.remove();
    }, 10000);
}
const eventSource = new EventSource("/sse/notifications/");
eventSource.addEventListener("newBoard", (e) => {
    const data = JSON.parse(e.data);
    const board_id = data['board_id'];
    const board_name = data['board_name'];
    const creator_username = data['creator_username'];
    const creator_is_admin = data['creator_is_admin'];
    let htmlMessage;
    if (!creator_is_admin) {
        htmlMessage = `
            <strong>${creator_username}</strong> created a new board
            <span class="text-neon-blue"><em>"${board_name}"</em></span> 
        `;
    }
    else {
        htmlMessage = `
            <span class="text-red-800"><strong>${creator_username}</strong></span>
            created a new board
            <span class="text-neon-blue"><em>"${board_name}"</em></span> 
        `;
    }
    showNotification(htmlMessage, true);
});
eventSource.addEventListener("newSubBoard", (e) => {
    const data = JSON.parse(e.data);
    const subboard_id = data["subboard_id"];
    const subboard_name = data["subboard_name"];
    const subboard_creator = data["subboard_creator"];
    const board_id = data["board_id"];
    const board_name = data["board_name"];
    const board_creator = data["board_creator"];
    const subboard_creator_is_admin = data["subboard_creator_is_admin"];
    const board_creator_is_admin = data["board_creator_is_admin"];
    let subboard_creator_html = `<strong>${subboard_creator}</strong>`;
    let board_creator_html = `<strong>${board_creator}</strong>`;
    if (subboard_creator_is_admin) {
        subboard_creator_html = `<span class="text-red-800">${subboard_creator_html}</span>`;
    }
    if (board_creator_is_admin) {
        board_creator_html = `<span class="text-red-800">${board_creator_html}</span>`;
    }
    const htmlMessage = `
        ${subboard_creator_html} created a new subboard
        <span class="text-neon-blue"><em>"${subboard_name}"</em></span> 
        based on ${board_creator_html}'s board 
        <span class="text-neon-blue"><em>"${board_name}"</em></span> 
    `;
    showNotification(htmlMessage, true);
});
eventSource.addEventListener("newPath", (e) => {
    const data = JSON.parse(e.data);
    const path_id = data["path_id"];
    const subboard_id = data["subboard_id"];
    const subboard_name = data["subboard_name"];
    const subboard_creator = data["subboard_creator"];
    const color = data["color"];
    const board_id = data["board_id"];
    const board_name = data["board_name"];
    const board_creator = data["board_creator"];
    const subboard_creator_is_admin = data["subboard_creator_is_admin"];
    const board_creator_is_admin = data["board_creator_is_admin"];
    let subboard_creator_html = `<strong>${subboard_creator}</strong>`;
    let board_creator_html = `<strong>${board_creator}</strong>`;
    if (subboard_creator_is_admin) {
        subboard_creator_html = `<span class="text-red-800">${subboard_creator_html}</span>`;
    }
    if (board_creator_is_admin) {
        board_creator_html = `<span class="text-red-800">${board_creator_html}</span>`;
    }
    const htmlMessage = `
        ${subboard_creator_html} created a
        <span style="color: ${color}">new path</span>
        on their subboard <span class="text-neon-blue"><em>"${subboard_name}"</em></span> 
        based on ${board_creator_html}'s board 
        <span class="text-neon-blue"><em>"${board_name}"</em></span> 
    `;
    showNotification(htmlMessage, true);
});
//# sourceMappingURL=base.js.map