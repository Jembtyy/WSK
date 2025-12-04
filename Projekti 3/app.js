$(document).ready(function () {

    // Lisätään tehtävä
    $("#addBtn").on("click", function () {
        const text = $("#taskInput").val().trim();
        if (!text) return;

        const li = $(`
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span class="task-text">${text}</span>
                <div>
                    <button class="btn btn-success btn-sm me-2 doneBtn">Valmis</button>
                    <button class="btn btn-danger btn-sm deleteBtn">Poista</button>
                </div>
            </li>
        `);

        $("#taskList").append(li.hide().fadeIn(300));
        $("#taskInput").val("");
    });

    // Merkitsee tehdyksi
    $("#taskList").on("click", ".doneBtn", function () {
        $(this).closest("li").find(".task-text").toggleClass("text-decoration-line-through text-muted");
    });

    // Poistaa tehtävän
    $("#taskList").on("click", ".deleteBtn", function () {
        $(this).closest("li").slideUp(300, function () {
            $(this).remove();
        });
    });

});