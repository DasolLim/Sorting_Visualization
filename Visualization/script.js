document.addEventListener('DOMContentLoaded', function () {
    const arraySizeInput = document.getElementById('arraySize');
    const arraySizeValue = document.getElementById('arraySizeValue');
    const algorithmSelect = document.getElementById('algorithm');
    const datasetSelect = document.getElementById('dataset');
    const speedInput = document.getElementById('speed');
    const speedValue = document.getElementById('speedValue');
    const barsContainer = document.getElementById('barsContainer');
    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const resumeButton = document.getElementById('resumeButton');
    const resetButton = document.getElementById('resetButton');

    let array = [];
    let intervalId;
    let paused = false;
    let sorting = false;
    let speed = 1000; // Default speed for visualization

    arraySizeInput.oninput = function () {
        arraySizeValue.textContent = this.value;
        generateArray(parseInt(this.value));
    };

    datasetSelect.onchange = function () {
        generateArray(parseInt(arraySizeInput.value)); // Update array when dataset changes
    };

    speedInput.oninput = function () {
        speedValue.textContent = this.value;
        speed = (1 - this.value / 100) * 990 + 10; //0.01 to 1 seconds
    };

    startButton.onclick = function () {
        if (sorting) return;
        sorting = true;
        generateArray(parseInt(arraySizeInput.value));
        visualizeSorting();
    };

    pauseButton.onclick = function () {
        paused = true;
    };

    resumeButton.onclick = function () {
        paused = false;
    };

    resetButton.onclick = function () {
        paused = false;
        sorting = false;
        clearInterval(intervalId);
        generateArray(parseInt(arraySizeInput.value)); // Regenerate array
        clearSortingClasses();
    };

    function clearSortingClasses() {
        const bars = document.querySelectorAll('.bar');
        bars.forEach(bar => bar.classList.remove('bar-sorting', 'bar-sorted'));
    }

    function generateArray(size) {
        array = [];
        barsContainer.innerHTML = '';

        for (let i = 0; i < size; i++) {
            let value;
            switch (datasetSelect.value) {
                case 'sorted':
                    value = i + 1;
                    break;
                case 'reversed':
                    value = size - i;
                    break;
                case 'nearly-sorted':
                    value = i + (Math.random() > 0.8 ? Math.floor(Math.random() * 5) : 0);
                    break;
                default:
                    value = Math.floor(Math.random() * 100) + 1;
            }
            array.push(value);

            const bar = document.createElement('div');
            bar.classList.add('bar');
            bar.style.height = `${array[i] * 3}px`;
            barsContainer.appendChild(bar);
        }
    }

    async function visualizeSorting() {
        const algorithm = algorithmSelect.value;

        switch (algorithm) {
            case 'bubble':
                await bubbleSort();
                break;
            case 'selection':
                await selectionSort();
                break;
            case 'insertion':
                await insertionSort();
                break;
            case 'merge':
                await mergeSort(array);
                break;
            case 'quick':
                await quickSort(array, 0, array.length - 1);
                break;
        }

        sorting = false; // Reset sorting state after completion
    }

    function updateBars() {
        const bars = document.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            bar.style.height = `${array[index] * 3}px`;
        });
    }

    async function bubbleSort() {
        let bars = document.querySelectorAll('.bar');
        let n = array.length;

        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                bars[j].classList.add('bar-sorting');
                bars[j + 1].classList.add('bar-sorting');

                if (array[j] > array[j + 1]) {
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                    updateBars();
                }

                await checkPaused();
                bars[j].classList.remove('bar-sorting');
                bars[j + 1].classList.remove('bar-sorting');
            }
            bars[n - i - 1].classList.add('bar-sorted');
        }
        bars[0].classList.add('bar-sorted');
    }

    async function selectionSort() {
        let bars = document.querySelectorAll('.bar');
        let n = array.length;

        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;

            for (let j = i + 1; j < n; j++) {
                bars[j].classList.add('bar-sorting');

                if (array[j] < array[minIndex]) {
                    minIndex = j;
                }

                await checkPaused();
                bars[j].classList.remove('bar-sorting');
            }

            if (minIndex !== i) {
                [array[i], array[minIndex]] = [array[minIndex], array[i]];
                updateBars();
            }
            bars[i].classList.add('bar-sorted');
        }
        bars[n - 1].classList.add('bar-sorted');
    }

    async function insertionSort() {
        let bars = document.querySelectorAll('.bar');
        let n = array.length;

        for (let i = 1; i < n; i++) {
            let key = array[i];
            let j = i - 1;

            bars[i].classList.add('bar-sorting');

            while (j >= 0 && array[j] > key) {
                array[j + 1] = array[j];
                updateBars();
                bars[j + 1].classList.add('bar-sorting');
                await checkPaused();
                bars[j + 1].classList.remove('bar-sorting');
                j--;
            }

            array[j + 1] = key;
            updateBars();
            bars[i].classList.remove('bar-sorting');
            bars[i].classList.add('bar-sorted');
        }
        bars[0].classList.add('bar-sorted');
    }

    async function mergeSort(array, left = 0, right = array.length - 1) {
        if (left >= right) return;

        const middle = Math.floor((left + right) / 2);
        await mergeSort(array, left, middle);
        await mergeSort(array, middle + 1, right);
        await merge(array, left, middle, right);
    }

    async function merge(array, left, middle, right) {
        const leftArray = array.slice(left, middle + 1);
        const rightArray = array.slice(middle + 1, right + 1);
        let i = 0, j = 0, k = left;
        const bars = document.querySelectorAll('.bar');

        while (i < leftArray.length && j < rightArray.length) {
            bars[k].classList.add('bar-sorting');
            if (leftArray[i] <= rightArray[j]) {
                array[k] = leftArray[i];
                i++;
            } else {
                array[k] = rightArray[j];
                j++;
            }
            bars[k].style.height = `${array[k] * 3}px`;
            await checkPaused();
            bars[k].classList.remove('bar-sorting');
            k++;
        }

        while (i < leftArray.length) {
            array[k] = leftArray[i];
            bars[k].style.height = `${array[k] * 3}px`;
            await checkPaused();
            i++;
            k++;
        }

        while (j < rightArray.length) {
            array[k] = rightArray[j];
            bars[k].style.height = `${array[k] * 3}px`;
            await checkPaused();
            j++;
            k++;
        }
        for (let idx = left; idx <= right; idx++) {
            bars[idx].classList.add('bar-sorted');
        }
    }

    async function quickSort(array, left, right) {
        if (left < right) {
            let pivotIndex = await partition(array, left, right);
            await quickSort(array, left, pivotIndex - 1);
            await quickSort(array, pivotIndex + 1, right);
        }
    }

    async function partition(array, left, right) {
        let bars = document.querySelectorAll('.bar');
        let pivot = array[right];
        let i = left - 1;

        bars[right].classList.add('bar-sorting');

        for (let j = left; j < right; j++) {
            bars[j].classList.add('bar-sorting');
            if (array[j] < pivot) {
                i++;
                [array[i], array[j]] = [array[j], array[i]];
                updateBars();
            }
            await checkPaused();
            bars[j].classList.remove('bar-sorting');
        }

        [array[i + 1], array[right]] = [array[right], array[i + 1]];
        updateBars();
        bars[right].classList.remove('bar-sorting');
        bars[i + 1].classList.add('bar-sorted');
        return i + 1;
    }

    async function checkPaused() {
        while (paused) {
            await sleep(10); // Check every 10ms if still paused
        }
        await sleep(speed); // Continue with the set speed
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
});
