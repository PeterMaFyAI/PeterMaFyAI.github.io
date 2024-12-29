document.addEventListener("DOMContentLoaded", () => {
    const container = document.createElement('div');
    container.className = 'menu-container';
    document.body.appendChild(container);

    const lessonDisplay = document.createElement('div');
    lessonDisplay.className = 'lesson-container';
    document.body.appendChild(lessonDisplay);

    const basePath = 'data/';
    const courses = {
        "Fysik 1": { chapters: 12, path: 'fysik1' },
        "Fysik 2": { chapters: 8, path: 'fysik2' }
    };

    // Function to create the main menu
    const createMenu = () => {
        const menu = document.createElement('ul');
        menu.className = 'menu';
        container.appendChild(menu);

        Object.entries(courses).forEach(([courseName, courseData]) => {
            const menuItem = createMenuItem(courseName, () => {
                createSubMenu(menuItem, courseData);
            });
            menu.appendChild(menuItem);
        });

        // Check for direct link and navigate automatically if applicable
        handleDirectLink();
    };

    // Function to create menu items
    const createMenuItem = (label, onClick) => {
        const item = document.createElement('li');
        item.className = 'menu-item';
        item.textContent = label;

        const arrow = document.createElement('span');
        arrow.textContent = ' ▶';
        arrow.className = 'arrow';
        item.appendChild(arrow);

        item.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent click from propagating
            onClick();
        });
        return item;
    };

    // Function to create submenus
    const createSubMenu = (parentItem, courseData) => {
        removeSubMenus(parentItem);

        const subMenu = document.createElement('ul');
        subMenu.className = 'submenu';

        for (let i = 1; i <= courseData.chapters; i++) {
            const chapterLabel = `Kapitel ${i}`;
            const chapterItem = createMenuItem(chapterLabel, () => {
                loadLessons(`${basePath}${courseData.path}/chapter${i}.json`, chapterItem);
            });
            subMenu.appendChild(chapterItem);
        }

        parentItem.appendChild(subMenu);
    };

    // Function to load and display lessons
    const loadLessons = (path, parentItem, callback) => {
        removeSubMenus(parentItem);

        fetch(path)
            .then(response => response.json())
            .then(lessons => {
                const lessonMenu = document.createElement('ul');
                lessonMenu.className = 'submenu';

                lessons.forEach(lesson => {
                    const lessonItem = document.createElement('li');
                    lessonItem.className = 'menu-item';
                    lessonItem.textContent = lesson.title;
                    lessonItem.addEventListener('click', () => displayLesson(lesson));
                    lessonMenu.appendChild(lessonItem);
                });

                parentItem.appendChild(lessonMenu);

                if (callback) callback(lessons);
            })
            .catch(error => {
                console.error('Error loading lessons:', error);
            });
    };

    // Function to display a selected lesson
    const displayLesson = (lesson) => {
        lessonDisplay.innerHTML = ''; // Clear the previous lesson display

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

        lessonDisplay.appendChild(title);
        lessonDisplay.appendChild(content);
        lessonDisplay.appendChild(resources);
    };

    // Function to remove all submenus
    const removeSubMenus = (parentItem) => {
        const subMenus = parentItem.querySelectorAll('.submenu');
        subMenus.forEach(subMenu => subMenu.remove());
    };

    // Handle Direct Linking
    const handleDirectLink = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const directCourse = urlParams.get('course');
        const directChapter = urlParams.get('chapter');
        const directLessonId = urlParams.get('lesson');
    
        console.log("Direct Linking Parameters:", { directCourse, directChapter, directLessonId });
    
        if (directCourse && directChapter) {
            const courseData = courses[directCourse];
            if (!courseData) {
                console.error("Course not found:", directCourse);
                return;
            }
    
            loadLessons(`${basePath}${courseData.path}/${directChapter}`, container, (lessons) => {
                if (!lessons) {
                    console.error("No lessons found in chapter:", directChapter);
                    return;
                }
    
                const lesson = lessons.find(l => l.id === directLessonId);
                if (lesson) {
                    displayLesson(lesson);
                } else {
                    console.error("Lesson not found:", directLessonId);
                }
            });
        }
    };


    createMenu();
});
