$(document).ready(function () {

    //set default category on first load page
    let categoriesFilter = getLocalStorage("categoriesFilter", {
        c1: true
    });


    //check if there is some value in local storage
    function getLocalStorage(key, defaultValue = null) {
        try {
            return localStorage.getItem(key) === null ? defaultValue : JSON.parse(localStorage.getItem(key));
        } catch (error) {
            if(error instanceof SyntaxError){
            console.log("Syntax error: " + error.message);  //error message
            console.error(error.name);                      // error type
            console.error(error.fileName);                  // file where is error
            console.error(error.lineNumber);                // on what line is error
            }     
            return defaultValue;
        }
    }

    //remeber selected category
    function setLocalStorage(key, value) {
        return localStorage.setItem(key, JSON.stringify(value));
    }

    //ajax callback function
    function getData(file, callback) {
        $.ajax({
            url: "assets/data/" + file + ".json",
            method: "get",
            dataType: "json",
            success: function (response) {
                callback(response);
            },
            error: function (err) {
                console.log(err);
            }
        });
    }

    //show header
    function displayHeader(data) {
        $('#header,#authonHeader').html(data.map((header) => ` <div class="col-md-6">
        <div class="top-bar-left">
            <div class="text">
                <h2>${header.workTime}</h2>
                <p>${header.textTime}</p>
            </div>
            <div class="text">
                <h2>${header.ourNumber}</h2>
                <p>${header.numberText}</p>
            </div>
        </div>
    </div>
    <div class="col-md-6">
        <div class="top-bar-right">
            <div class="social" id="Social">

            </div>
        </div>
    </div>`));
    }
    getData('our-info', displayHeader);


    //display menu
    getData('menu', displayMenu);

    function displayMenu(data) {
        $('#menu,#authorMenu').html(data.map((menu) => `<a href="${menu.href}" class="nav-item nav-link">${menu.name}</a>`));
    }

    //display category
    function displayCategories(data) {
        // render HTML
        $('#category').html(data.map((category) => `<li data-category-id="${category.id}" class="${categoriesFilter[category.id] === true ? 'filter-active': ''}">${category.name}</li>`).join(""));

        // Attach event listeners to filters
        $('#category li').on('click', function (e) {
            const clickedElement = $(e.target);
            const clickedElementCategoryId = clickedElement.attr('data-category-id');

            if (clickedElement.hasClass('filter-active')) {
                if ($('#category li.filter-active').length <= 1) {
                    $('#category li[data-category-id=c1]').addClass('filter-active');
                    categoriesFilter.c1 = true;
                }

                clickedElement.removeClass('filter-active');
                delete categoriesFilter[clickedElementCategoryId];
                getData('services', displayServices);
                setLocalStorage("categoriesFilter", categoriesFilter)
                return;
            }

            if (clickedElementCategoryId == 'c1') {
                $('#category li').removeClass('filter-active');
                categoriesFilter = {
                    c1: true
                };
            }

            clickedElement.addClass('filter-active');
            categoriesFilter[clickedElementCategoryId] = true;

            if ($('#category li.filter-active').length > 1) {
                $('#category li[data-category-id=c1]').removeClass('filter-active');
                if (categoriesFilter.c1) {
                    delete categoriesFilter.c1;
                }
            }

            getData('services', displayServices);
            setLocalStorage("categoriesFilter", categoriesFilter)
        });
    }
    getData('category', displayCategories);

    //display services
    function displayServices(data) {
        //filter data of selected category
        const filteredData = categoriesFilter.c1 === true ? data : data
            .filter((service) => {
                let atLeastOneCategory = false;

                service.category.forEach(el => {
                    if (categoriesFilter[el] === true) {
                        atLeastOneCategory = true;
                    }
                });

                return atLeastOneCategory;
            });
        // render HTML
        let html = "";
        filteredData.forEach(service => {
            html += `<div class="col-xl-3 col-lg-4 col-md-6 col-sm-8 text-center">
                        <div class="tittle ">
                            <h4>${service.name}</h4>
                        </div>
                        <div class="image-size my-3">
                            <img class="card-img-top" src="${service.pic.src}" alt="${service.pic.alt}"/>
                        </div>
                        <div class="text text-justify mx-2">
                            <p>
                                ${service.description}
                            </p>
                        </div>
                        <div class="toBottom">
                            <div>
                                <p>
                                    Price: $${service.price}
                                </p>
                            </div>
                            <div class="book">
                                <a href="#Contact" class="btn btn-primary book-it-click" data-service-id="${service.id}">BOOK IT</a>
                            </div>
                        </div>
                    </div>`;
        });

        document.getElementById('services').innerHTML = html;
        //when u click on book now scroll to contact form and select clicked option
        $('#contactForm #select-service').html(data.map((s) => `<option value="${s.id}">${s.name}  $${s.price}</option>`).join(''));
        $('#services .book-it-click').on('click', function (e) {
            const clickedElementServiceId = $(e.target).attr('data-service-id');
            $('#contactForm #select-service').val(clickedElementServiceId);
        });
    }
    getData('services', displayServices);

    //show our team
    function displayTeam(data) {
        //render HTML
        $('#Team').html(data.map((team) => `<div class="col-lg-3 col-md-6">
                                                <div class="team-item">
                                                    <div class="team-img">
                                                        <img src="${team.pic.src}" alt="${team.pic.alt}">
                                                    </div>
                                                    <div class="team-text">
                                                        <h2>${team.name}</h2>
                                                        <p>${team.description}</p>
                                                    </div>
                                                </div>
                                            </div>`));
    }
    getData('team', displayTeam);

    function displayFooter(data) {
        $('#Footer').html(data.map((footer) => `<div class="col-md-9">
        <div class="footer-contact">
            <h2>Salon Address</h2>
            <p><i class="${footer.ourLocationIcon}"></i>${footer.ourLocation}</p>
            <p><i class="${footer.ourNumberIcon}"></i>${footer.ourNumber}</p>
            <p><i class="${footer.ourEmailIcon}"></i>${footer.ourEmail}</p>
            <div class="footer-social" id="Footer-social">
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="footer-link">
            <h2>Quick Links</h2>
            <div id="quick">
                
            </div>   
                     
        </div>
        <div class="modal fade" id="Author" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        
            </div>
    </div>
    `));
    }
    getData('our-info', displayFooter);

    getData('author', displayAuthor);

    //author info
    function displayAuthor(data) {
        $('#Author').html(data.map((author) => `<div class="modal-dialog modal-dialog-centered" role="document">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h5 class="modal-title" id="exampleModalLongTitle">${author.title}</h5>                                                        
                                                    </div>
                                                    <div class="modal-body">
                                                        <div class="row">
                                                            <div class="col s12 m6" id="pauthor">
                                                                <img src="${author.pic.src}" alt="${author.pic.alt}">
                                                            </div>
                                                            <div class="row col s12 m6" id="tauthor">
                                                                <div class="col s12">
                                                                    <h2>
                                                                    ${author.name}
                                                                    </h2>
                                                                </div>
                                                                <div class="col s12">
                                                                    <p>
                                                                        My index number is ${author.index}
                                                                    </p>
                                                                    <p>
                                                                    ${author.description}
                                                                    </p>
                                                                    <p>
                                                                        ${author.infoDestination}
                                                                        <a class="tekst" href="${author.href}" target="_blank">here</a>.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="modal-footer">
                                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                                    </div>
                                                </div>
                                            </div>`));
    }

    //show quick links
    function displayQuickLinks(data) {
        $('#quick').html(data.map((quick) => `
                <a href="${quick.href}">${quick.name}</a>
        `));
        $('#quick').append(`<button type="button" class="btn card-link blink" data-toggle="modal" data-target="#Author">Author</button>`);
    }
    getData('quickLink', displayQuickLinks);

    //show social network links
    function displaySocial(data) {
        //render HTML
        $('#Footer-social,#Social').html(data.map((social) => ` <a href="${social.href}" target="_blank"><i class="${social.iconClass}"></i></a>`));
    }
    getData('social', displaySocial);

    //form validate
    document.getElementById("btnCheck").addEventListener("click", forma);

    function forma() {
        var name = document.getElementById("fname");
        var surname = document.getElementById("lname");
        var email = document.getElementById("email");
        var bookDate = document.getElementById("book-it");
        var subject = document.getElementById("subject");
        var message = document.getElementById("message");
        var today = new Date();
        var date = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
        var selectedDate = bookDate.value;
        // dozvoljene vrednosti
        var reNameSurname = /^([A-ZĐŽŠČĆ][a-zđžščć]{2,20})+$/ //at least 3 characters and first letter upper and max 20 characters with Serbian alphabet
        var reEmail = /^[a-z][\w\.]*\@[a-z0-9]{3,20}(\.[a-z]{3,5})?\.[a-z]{2,3}$/
        var reLength = /^[A-z][\w]{2,}/
        var validator = 0;
        //name 
        if (!reNameSurname.test(name.value)) {
            name.innerHTML = "";
            name.nextElementSibling.innerHTML = "First name must have first letter uppercase and minimum 3 letters in total.";
            name.classList.add("borderRed");
            name.nextElementSibling.classList.add("textRed");
            validator++;
        } else {
            name.innerHTML = "";
            name.nextElementSibling.innerHTML = "";
            name.classList.remove("borderRed");
            name.nextElementSibling.classList.remove("textRed");
        }
        //surname
        if (!reNameSurname.test(surname.value)) {
            surname.innerHTML = "";
            surname.nextElementSibling.innerHTML = "Last name must have first letter uppercase and minimum 3 letters in total.";
            surname.classList.add("borderRed");
            surname.nextElementSibling.classList.add("textRed");
            validator++;
        } else {
            surname.innerHTML = "";
            surname.nextElementSibling.innerHTML = "";
            surname.classList.remove("borderRed");
            surname.nextElementSibling.classList.remove("textRed");
        }
        //email 
        if (!reEmail.test(email.value)) {
            email.innerHTML = "";
            email.nextElementSibling.innerHTML = 'The email must have minimum 3 character before @.';
            email.classList.add("borderRed");
            email.nextElementSibling.classList.add("textRed");
            validator++;
        } else {
            email.innerHTML = "";
            email.nextElementSibling.innerHTML = '';
            email.classList.remove("borderRed");
            email.nextElementSibling.classList.remove("textRed");
        }
        //bookDate
        if (!bookDate.value) {
            bookDate.nextElementSibling.innerHTML = 'Please book date.';
            bookDate.classList.add("borderRed");
            bookDate.nextElementSibling.classList.add("textRed");
            validator++;
        } else if (selectedDate < date) {
            bookDate.nextElementSibling.innerHTML = "Booking in past isn't possible.";
            bookDate.classList.add("borderRed");
            bookDate.nextElementSibling.classList.add("textRed");
            validator++;
        } else {
            bookDate.nextElementSibling.innerHTML = '';
            bookDate.classList.remove("borderRed");
            bookDate.nextElementSibling.classList.remove("textRed");
        }
        //subject
        if (!reLength.test(subject.value)) {
            subject.nextElementSibling.innerHTML = 'Please write subject, minimum 3 characters and start with letter.';
            subject.classList.add("borderRed");
            subject.nextElementSibling.classList.add("textRed");
            validator++;
        } else {
            subject.nextElementSibling.innerHTML = '';
            subject.classList.remove("borderRed");
            subject.nextElementSibling.classList.remove("textRed");
        }
        //message length check
        if (!reLength.test(message.value)) {
            message.nextElementSibling.innerHTML = 'Please write question or some information about your booking, minimum 3 characters and start with letter.';
            message.classList.add("borderRed");
            message.nextElementSibling.classList.add("textRed");
            validator++;
        } else {
            message.nextElementSibling.innerHTML = '';
            message.classList.remove("borderRed");
            message.nextElementSibling.classList.remove("textRed");
        }
        console.log(validator);
        if (validator == 0) {
            window.alert("Expect mail from our customer service.");
        }
    }

    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({
            scrollTop: 0
        }, 1500, 'easeInOutExpo');
        return false;
    });

    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            $('.navbar').addClass('nav-sticky');
        } else {
            $('.navbar').removeClass('nav-sticky');
        }
    });

    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
});