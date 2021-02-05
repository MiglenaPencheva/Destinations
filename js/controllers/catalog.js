import { getAll, createDestination, checkResult, getDestinationById, editDestination, deleteDestination as apiDestination } from '../data.js';
import { showError, showInfo } from '../notifications.js';

export async function home() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),
        destination: await this.load('./templates/catalog/destination.hbs')
    };

    const context = Object.assign({}, this.app.userData);
    if (this.app.userData.email) {
        const destinations = await getAll();
        context.destinations = destinations;
    }

    this.partial('./templates/home.hbs', context);
}

export async function myDestinationsPage() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),
        myDestination: await this.load('./templates/catalog/myDestination.hbs')
    };

    const context = Object.assign({}, this.app.userData);
    const destinations = await getAll();

    const myDestinations = destinations.filter(d => d.ownerId === context.email);
    context.myDestinations = myDestinations;

    this.partial('./templates/catalog/myDestinations.hbs', context);
}

export async function createPage() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs')
    };

    this.partial('./templates/catalog/create.hbs', this.app.userData);
}

export async function createPost() {
    const destination = {
        name: this.params.destination,
        city: this.params.city,
        duration: Number(this.params.duration),
        departure: this.params.departureDate,
        imgUrl: this.params.imgUrl,
        ownerId: this.app.userData.email
    };

    try {
        if (destination.name === '') {
            throw new Error('Destination name is required');
        }
        if (destination.city === '') {
            throw new Error('City is required');
        }
        if (destination.duration < 1 || destination.duration > 100) {
            throw new Error('Duration should be between 1 and 100 days');
        }
        if (destination.departure === '') {
            throw new Error('Departure is required');
        }
        if (destination.imgUrl === '') {
            throw new Error('Image is required');
        }
        if (destination.imgUrl.slice(0, 7) != 'http://' && destination.imgUrl.slice(0, 8) != 'https://') {
            throw new Error('Invalid image URL');
        }

        // https://live.staticflickr.com/5151/5884579322_66a0cb82fa_b.jpg
        // https://live.staticflickr.com/362/18896132939_a5d4993a0d_b.jpg
        // https://live.staticflickr.com/350/18967063098_2413cea308_b.jpg
        // https://live.staticflickr.com/505/18462321763_a4d45a824e_b.jpg


        const result = await createDestination(destination);
        checkResult(result);

        showInfo('Destination added successfully.');
        this.redirect('#/home');

    } catch (err) {
        showError(err.message);
    }
}

export async function editPage() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs')
    };

    const destination = await getDestinationById(this.params.id);
    const context = Object.assign({ destination }, this.app.userData);

    await this.partial('./templates/catalog/edit.hbs', context);
}

export async function editPost() {
    const id = this.params.id;
    const destination = await getDestinationById(id);

    destination.name = this.params.destination;
    destination.city = this.params.city;
    destination.duration = Number(this.params.duration);
    destination.departure = this.params.departureDate;
    destination.imgUrl = this.params.imgUrl;

    try {
        if (destination.name === '') {
            throw new Error('Destination name is required');
        }
        if (destination.city === '') {
            throw new Error('City is required');
        }
        if (destination.duration < 1 || destination.duration > 100) {
            throw new Error('Duration should be between 1 and 100 days');
        }
        if (destination.departure === '') {
            throw new Error('Departure is required');
        }
        if (destination.imgUrl === '') {
            throw new Error('Image is required');
        }
        if (destination.imgUrl.slice(0, 7) != 'http://' && destination.imgUrl.slice(0, 8) != 'https://') {
            throw new Error('Invalid image URL');
        }

        const result = await editDestination(id, destination);
        checkResult(result);

        showInfo('Destination edited successfully.');
        this.redirect(`#/details/${id}`);

    } catch (err) {
        showError(err.message);
    }
}

export async function detailsPage() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs')
    };

    const destination = await getDestinationById(this.params.id);
    const context = Object.assign({ destination }, this.app.userData);

    if (destination.ownerId === this.app.userData.userId) {
        destination.canEdit = true;
    }

    this.partial('./templates/catalog/details.hbs', context);
}

export async function deleteDestination() {
    const id = this.params.id;
        try {
            const result = await apiDestination(id);
            checkResult(result);
            showInfo('Destination deleted.');
            this.redirect('#/myDestinations');
        } catch (error) {
            showError(err.message);
        }
}