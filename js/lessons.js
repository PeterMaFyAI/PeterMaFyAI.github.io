document.addEventListener("DOMContentLoaded", () => {
    const lessonsContainer = document.createElement('div');
    lessonsContainer.className = 'lessons-container';
    document.body.appendChild(lessonsContainer);

    fetch('data/physics-lessons.json')
        .then(response => response.json())
        .then(lessons => {
            lessons.forEach(lesson => {
                const lessonDiv = document.createElement('div');
                lessonDiv.className = 'lesson';

                const title = document.createElement('h2');
                title.textContent = lesson.title;

                const content = document.createElement('p');
                content.textContent = lesson.content;

                const resources = document.createElement('ul');
                resources.className = 'resources';
                lesson.resources.forEach(resource => {
                    const resourceItem = document.createElement('li');
                    if (resource.type === 'video') {
                        const iframe = document.createElement('iframe');
                        iframe.src = resource.url;
                        iframe.setAttribute('allowfullscreen', '');
                        iframe.className = 'lesson-video';
                        resourceItem.appendChild(iframe);
                    } else if (resource.type === 'link') {
                        const link = document.createElement('a');
                        link.href = resource.url;
                        link.textContent = 'Read more';
                        link.target = '_blank';
                        resourceItem.appendChild(link);
                    }
                    resources.appendChild(resourceItem);
                });

                lessonDiv.appendChild(title);
                lessonDiv.appendChild(content);
                lessonDiv.appendChild(resources);
                lessonsContainer.appendChild(lessonDiv);
            });
        })
        .catch(error => {
            console.error('Error loading lessons:', error);
        });
});
