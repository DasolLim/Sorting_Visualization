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
    const stepButton = document.getElementById('stepButton');

    let array = [];
    let intervalId;
    let paused = false;
    let currentIndex = 0;
    let speed = 1000; // Default speed for visualization

    arraySizeInput.oninput = function () {
        arraySizeValue.textContent = this.value;
        generateArray(parseInt(this.value));
    };

    speedInput.oninput = function () {
        speedValue.textContent = this.value;
        speed = (1 - this.value / 100) * 990 + 10; //0.01 to 1 seconds
    };

    startButton.onclick = function () {
        generateArray(parseInt(arraySizeInput.value));
        visualizeSorting();
    };

    function generateArray(size) {
        array = [];
        barsContainer.innerHTML = '';
        for (let i = 0; i < size; i++) {
            array.push(Math.floor(Math.random() * 100) + 1);
            const bar = document.createElement('div');
            bar.classList.add('bar');
            bar.style.height = `${array[i] * 3}px`; // Scale height for visibility
            barsContainer.appendChild(bar);
        }
    }

    function visualizeSorting() {
        const algorithm = algorithmSelect.value;
        clearInterval(intervalId); // Clear previous interval
        currentIndex = 0;

        switch (algorithm) {
            case 'bubble':
                bubbleSort();
                break;
            case 'selection':
                selectionSort();
                break;
            case 'insertion':
                insertionSort();
                break;
            case 'merge':
                mergeSort(array);
                break;
            case 'quick':
                quickSort(array, 0, array.length - 1);
                break;
        }
    }

    function updateBars() {
        const bars = document.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            bar.style.height = `${array[index] * 3}px`;
        });
    }
    // Inside your sorting functions, such as bubbleSort, selectionSort, etc.
    async function bubbleSort() {
        let bars = document.querySelectorAll('.bar');
        let n = array.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                // Add 'bar-sorting' class to the bars being compared
                bars[j].classList.add('bar-sorting');
                bars[j + 1].classList.add('bar-sorting');

                if (array[j] > array[j + 1]) {
                    // Swap bars if necessary
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                    updateBars();
                }

                // Wait based on the speed value
                await sleep(speed);

                // Remove 'bar-sorting' class after comparison
                bars[j].classList.remove('bar-sorting');
                bars[j + 1].classList.remove('bar-sorting');
            }
            // Mark the last sorted bar
            bars[n - i - 1].classList.add('bar-sorted');
        }
        // Mark the remaining bar as sorted
        bars[0].classList.add('bar-sorted');
    }

    async function selectionSort() {
        let bars = document.querySelectorAll('.bar');
        let n = array.length;
        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;
            for (let j = i + 1; j < n; j++) {
                // Add 'bar-sorting' class to the bar being checked
                bars[j].classList.add('bar-sorting');

                if (array[j] < array[minIndex]) {
                    minIndex = j;
                }

                // Wait based on the speed value
                await sleep(speed);

                // Remove 'bar-sorting' class after comparison
                bars[j].classList.remove('bar-sorting');
            }
            if (minIndex !== i) {
                [array[i], array[minIndex]] = [array[minIndex], array[i]];
                updateBars();
            }
            // Mark the sorted bar
            bars[i].classList.add('bar-sorted');
        }
        // Mark the last bar as sorted
        bars[n - 1].classList.add('bar-sorted');
    }

    async function insertionSort() {
        let bars = document.querySelectorAll('.bar');
        let n = array.length;
        for (let i = 1; i < n; i++) {
            let key = array[i];
            let j = i - 1;

            bars[i].classList.add('bar-sorting'); // Highlight the current bar

            while (j >= 0 && array[j] > key) {
                array[j + 1] = array[j];
                updateBars();
                bars[j + 1].classList.add('bar-sorting'); // Highlight the comparison bar
                await sleep(speed); // Wait based on the speed value
                bars[j + 1].classList.remove('bar-sorting'); // Remove highlight after comparison
                j--;
            }
            array[j + 1] = key;
            updateBars();
            bars[i].classList.remove('bar-sorting'); // Remove highlight for the current bar
            bars[i].classList.add('bar-sorted'); // Mark the sorted bar
        }
        // Mark the remaining sorted bar
        bars[0].classList.add('bar-sorted');
    }

    // async function mergeSort(array, left, right) {
    //     // Base case: return if the subarray has one or no elements
    //     if (left >= right) {
    //         return;
    //     }

    //     // Find the middle index to split the array
    //     const middle = Math.floor((left + right) / 2);

    //     // Recursively sort the left and right halves
    //     await mergeSort(array, left, middle);       // Sort left half
    //     await mergeSort(array, middle + 1, right);  // Sort right half

    //     // Merge the sorted halves
    //     await merge(array, left, middle, right);
    // }

    // async function merge(array, left, middle, right) {
    //     let bars = document.querySelectorAll('.bar');

    //     // Create temporary arrays to store the left and right halves
    //     let n1 = middle - left + 1;
    //     let n2 = right - middle;

    //     let leftArray = new Array(n1);
    //     let rightArray = new Array(n2);

    //     // Copy data into the temporary arrays
    //     for (let i = 0; i < n1; i++) {
    //         leftArray[i] = array[left + i];
    //         bars[left + i].classList.add('bar-sorting');  // Highlight the left partition bars
    //     }
    //     for (let i = 0; i < n2; i++) {
    //         rightArray[i] = array[middle + 1 + i];
    //         bars[middle + 1 + i].classList.add('bar-sorting');  // Highlight the right partition bars
    //     }

    //     await sleep(speed);  // Pause for visualization

    //     // Merge the two arrays back into array[left..right]
    //     let i = 0, j = 0, k = left;
    //     while (i < n1 && j < n2) {
    //         if (leftArray[i] <= rightArray[j]) {
    //             array[k] = leftArray[i];
    //             i++;
    //         } else {
    //             array[k] = rightArray[j];
    //             j++;
    //         }
    //         updateBars();  // Update the bars in the UI
    //         bars[k].classList.add('bar-sorting');  // Highlight the current bar being merged
    //         await sleep(speed);  // Pause for visualization
    //         bars[k].classList.remove('bar-sorting');  // Remove highlight after merging
    //         k++;
    //     }

    //     // Copy any remaining elements of leftArray
    //     while (i < n1) {
    //         array[k] = leftArray[i];
    //         updateBars();
    //         bars[k].classList.add('bar-sorting');
    //         await sleep(speed);
    //         bars[k].classList.remove('bar-sorting');
    //         i++;
    //         k++;
    //     }

    //     // Copy any remaining elements of rightArray
    //     while (j < n2) {
    //         array[k] = rightArray[j];
    //         updateBars();
    //         bars[k].classList.add('bar-sorting');
    //         await sleep(speed);
    //         bars[k].classList.remove('bar-sorting');
    //         j++;
    //         k++;
    //     }

    //     // Mark the fully sorted section
    //     for (let i = left; i <= right; i++) {
    //         bars[i].classList.add('bar-sorted');
    //     }
    // }

    async function quickSort(array, left, right) {
        if (left < right) {
            let pivotIndex = await partition(array, left, right);

            // Left partition sort
            await quickSort(array, left, pivotIndex - 1);

            // Right partition sort
            await quickSort(array, pivotIndex + 1, right);

            // Mark the fully sorted segment only after partitioning completes for both sides
            let bars = document.querySelectorAll('.bar');
            for (let i = left; i <= right; i++) {
                bars[i].classList.add('bar-sorted');
            }
        }
    }

    async function partition(array, left, right) {
        let bars = document.querySelectorAll('.bar');
        let pivot = array[right];
        let i = left - 1;

        bars[right].classList.add('bar-sorting');  // Highlight the pivot element

        for (let j = left; j < right; j++) {
            bars[j].classList.add('bar-sorting');  // Highlight the current element being compared

            if (array[j] < pivot) {
                i++;
                [array[i], array[j]] = [array[j], array[i]];  // Swap elements
                updateBars();
                bars[i].classList.add('bar-sorting');
                await sleep(speed);
                bars[i].classList.remove('bar-sorting');
            }

            await sleep(speed);  // Wait to visualize the comparison
            bars[j].classList.remove('bar-sorting');
        }

        [array[i + 1], array[right]] = [array[right], array[i + 1]];  // Swap pivot element
        updateBars();
        await sleep(speed);

        bars[right].classList.remove('bar-sorting');
        bars[i + 1].classList.add('bar-sorted');  // Mark pivot element as sorted

        return i + 1;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
});
