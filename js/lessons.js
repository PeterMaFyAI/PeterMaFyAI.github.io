document.addEventListener("DOMContentLoaded", () => {
    const container = document.createElement('div');
    container.className = 'menu-container';
    document.body.appendChild(container);

    const lessonDisplay = document.createElement('div');
    lessonDisplay.className = 'lesson-container';
    document.body.appendChild(lessonDisplay);

    const quizContainer = document.getElementById('quiz-container');
    if (quizContainer) {
        lessonDisplay.insertAdjacentElement('afterend', quizContainer);
    }

    const basePath = 'data/';

    // Get the subject from the body attribute
    const subject = document.body.getAttribute('data-subject');
    if (!subject) {
        console.error("No subject specified in the HTML file.");
        return;
    }

    const loadCourses = () => {
        fetch(`${basePath}${subject}/courses.json`)
            .then(response => response.json())
            .then(courses => {
                const menu = document.createElement('ul');
                menu.className = 'menu';
                container.appendChild(menu);

                courses.forEach(course => {
                    const menuItem = createMenuItem(course.displayName, () => {
                        createSubMenu(menuItem, course);
                    });
                    menu.appendChild(menuItem);
                });

                handleDirectLink();
            })
            .catch(error => {
                console.error(`Error loading courses for subject ${subject}:`, error);
            });
    };

    const createMenuItem = (label, onClick) => {
        const item = document.createElement('li');
        item.className = 'menu-item';
        item.textContent = label;

        const arrow = document.createElement('span');
        arrow.textContent = ' ▶';
        arrow.className = 'arrow';
        item.appendChild(arrow);

        item.addEventListener('click', (e) => {
            e.stopPropagation();
            onClick();
        });
        return item;
    };

    const createSubMenu = (parentItem, course) => {
        removeSubMenus(parentItem);

        const subMenu = document.createElement('ul');
        subMenu.className = 'submenu';

        for (let i = 1; i <= course.chapters; i++) {
            const chapterLabel = `Kapitel ${i}`;
            const chapterItem = createMenuItem(chapterLabel, () => {
                loadLessons(`${basePath}${subject}/${course.id}/chapter${i}.json`, chapterItem);
            });
            subMenu.appendChild(chapterItem);
        }

        parentItem.appendChild(subMenu);
    };

    const loadLessons = (path, parentItem, callback) => {
        removeSubMenus(parentItem);

        fetch(path)
            .then(response => response.json())
            .then(lessons => {
                const lessonMenu = document.createElement('ul');
                lessonMenu.className = 'submenu';

                lessons.forEach(lesson => {
                    lesson.course = path.split('/')[2];
                    lesson.chapter = path.split('/')[3].replace('.json', '');

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

    const displayLesson = (lesson) => {
        lessonDisplay.innerHTML = '';

        const title = document.createElement('h2');
        title.textContent = lesson.title;

        const content = document.createElement('p');
        content.textContent = lesson.content;

        const bookPages = document.createElement('p');
        bookPages.innerHTML = `<strong>Läs:</strong> ${lesson.bookPages}`;

        const exercises = document.createElement('p');
        exercises.innerHTML = `<strong>Räkna:</strong> ${lesson.exercises}`;

        const lessonNotes = document.createElement('ul');
        lessonNotes.className = 'lesson-notes';
        lessonNotes.innerHTML = '<strong>Anteckningar:</strong>';

        if (lesson.lessonNotes && lesson.lessonNotes.length > 0) {
            lesson.lessonNotes.forEach(note => {
                const noteItem = document.createElement('li');
                const noteLink = document.createElement('a');
                noteLink.href = note.url;
                noteLink.textContent = note.title;
                noteLink.target = '_blank';
                noteItem.appendChild(noteLink);
                lessonNotes.appendChild(noteItem);
            });
        } else {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = "Inga anteckningar tillgängliga.";
            lessonNotes.appendChild(emptyMessage);
        }

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
        lessonDisplay.appendChild(bookPages);
        lessonDisplay.appendChild(exercises);
        lessonDisplay.appendChild(lessonNotes);
        lessonDisplay.appendChild(resources);

        // Add "Starta Quiz" button to the quiz-container
        const quizContainer = document.getElementById('quiz-container');
        quizContainer.innerHTML = ''; // Clear any previous content
        const quizButton = document.createElement('button');
        quizButton.className = 'btn';
        quizButton.textContent = 'Starta Quiz';
        quizButton.addEventListener('click', () => {
            const event = new CustomEvent("startQuiz", {
                detail: {
                    lessonId: lesson.id,
                    course: lesson.course,
                    chapter: lesson.chapter
                }
            });
            document.dispatchEvent(event);
        });

        quizContainer.appendChild(quizButton);

        const newUrl = `${window.location.pathname}?course=${lesson.course}&chapter=${lesson.chapter}&lesson=${lesson.id}`;
        history.pushState(null, '', newUrl);
    };

    const removeSubMenus = (parentItem) => {
        const subMenus = parentItem.querySelectorAll('.submenu');
        subMenus.forEach(subMenu => subMenu.remove());
    };

    const handleDirectLink = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const directCourse = urlParams.get('course');
        const directChapter = urlParams.get('chapter');
        const directLessonId = urlParams.get('lesson');

        if (directCourse && directChapter) {
            const path = `${basePath}${subject}/${directCourse}/${directChapter}.json`;

            loadLessons(path, container, (lessons) => {
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

    // Load courses for the specified subject
    loadCourses();
});
