document.addEventListener("DOMContentLoaded", () => {
    const container = document.createElement('div');
    container.className = 'lesson-container';
    document.body.appendChild(container);

    const basePath = 'data/';
    let currentCourse = null;
    let currentChapter = null;

    // Step 1: Load Courses
    const courses = {
        "Fysik 1": "fysik1",
        "Fysik 2": "fysik2"
    };

    const createDropdown = (options, placeholder, onChange) => {
        const select = document.createElement('select');
        const defaultOption = document.createElement('option');
        defaultOption.textContent = placeholder;
        defaultOption.disabled = true;
        defaultOption.selected = true;
        select.appendChild(defaultOption);

        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            select.appendChild(option);
        });

        select.addEventListener('change', () => onChange(select.value));
        container.appendChild(select);
    };

    createDropdown(
        Object.entries(courses).map(([label, value]) => ({ label, value })),
        "Select Course",
        course => {
            currentCourse = course;
            loadChapters(course);
        }
    );

    // Step 2: Load Chapters
    const loadChapters = (course) => {
        container.innerHTML = ''; // Clear previous selections
        createDropdown(
            Array.from({ length: course === 'fysik1' ? 12 : 8 }, (_, i) => ({
                label: `Chapter ${i + 1}`,
                value: `chapter${i + 1}.json`
            })),
            "Select Chapter",
            chapter => {
                currentChapter = chapter;
                loadLessons(`${basePath}${course}/${chapter}`);
            }
        );
    };

    // Step 3: Load Lessons
    const loadLessons = (path) => {
        container.innerHTML = ''; // Clear previous selections
        fetch(path)
            .then(response => response.json())
            .then(lessons => {
                lessons.forEach(lesson => {
                    const button = document.createElement('button');
                    button.textContent = lesson.title;
                    button.className = 'btn';
                    button.addEventListener('click', () => displayLesson(lesson));
                    container.appendChild(button);
                });
            })
            .catch(error => {
                console.error('Error loading lessons:', error);
            });
    };

    // Step 4: Display Lesson
    const displayLesson = (lesson) => {
        container.innerHTML = ''; // Clear previous selections

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

        container.appendChild(title);
        container.appendChild(content);
        container.appendChild(resources);
    };
    // Direct Linking Script Addition
    const urlParams = new URLSearchParams(window.location.search);
    const directCourse = urlParams.get('course');
    const directChapter = urlParams.get('chapter');
    const directLessonId = urlParams.get('lesson');

    if (directCourse && directChapter) {
        loadLessons(`${basePath}${directCourse}/${directChapter}`, (lessons) => {
            if (directLessonId) {
                const lesson = lessons.find(l => l.id === directLessonId);
                if (lesson) displayLesson(lesson);
            }
        });
    }   
});
