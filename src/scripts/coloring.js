(function () {
    const outputWidth = 1200;
    const outputMargin = 15;

    [...document.getElementById('drawings').getElementsByTagName('div')].forEach(element =>
        element.addEventListener('click', event => {
            const obj = event.target.querySelector('object');
            document.getElementById('drawing').setAttribute('data', obj.getAttribute('data'));
        })
    );

    let currentFill = getBackgroundColor(document.querySelector('.color.selected'));

    document.getElementById('colors').addEventListener('click', event => {
        if (event.target.classList.contains('color')) {
            currentFill = getBackgroundColor(event.target);
            document.querySelector('.color.selected').classList.remove('selected');
            event.target.classList.add('selected');
        } else {
            event.target.parentElement.click();
        }
    });

    document.getElementById('drawing').addEventListener('load', loadEvent => {
        const svg = loadEvent.target.contentDocument.getElementsByTagName('svg')[0];
        svg.addEventListener('mousedown', clickEvent => {
            if (clickEvent.target.tagName !== 'svg' && !clickEvent.target.classList.contains('nocolor')) {
                paint(clickEvent.target);
            }
        });

        document.getElementById('download').addEventListener('click', event => {
            const svgData = new XMLSerializer().serializeToString(svg);

            const img = document.createElement('img');
            img.setAttribute('src', 'data:image/svg+xml;base64,' + btoa(svgData));

            const canvas = document.createElement('canvas');

            img.onload = function () {
                const outputHeight = outputWidth * img.height / img.width;
                canvas.width = outputWidth + outputMargin * 2;
                canvas.height = outputHeight + outputMargin * 2;

                const ctx = canvas.getContext('2d');

                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.drawImage(img, outputMargin, outputMargin, outputWidth, outputHeight);

                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = 'image.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };
        });
    });

    function getBackgroundColor(target) {
        return getComputedStyle(target).getPropertyValue('background-color');
    }

    function paint(target) {
        target.style.fill = currentFill;
    }
})();
