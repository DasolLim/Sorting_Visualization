document.addEventListener('DOMContentLoaded', function () {
    const submitBtn = document.getElementById('submitBtn');
    const hintBtn = document.getElementById('hintBtn');
    const restartBtn = document.getElementById('restartBtn');
    const codeBlock = document.getElementById('code_block');

    // Handle submit button
    submitBtn.onclick = function () {
        alert('Submitted');
    };

    // Handle hint button
    hintBtn.onclick = function () {
        alert('Try starting with defining your function: def bubble_sort(arr):');
    };

    // Handle restart button
    restartBtn.onclick = function () {
        codeBlock.innerHTML = "# Type your sorting algorithm here...";
    };
});
