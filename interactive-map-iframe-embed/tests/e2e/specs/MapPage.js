const { parkMap } = require('../assets/parkmap.js');

 // Rendirect to login page
before(() => {
    cy.server();
    cy.route('https://interactive-map-api.herokuapp.com/public/maps/123456789012345678901234', { 
        data: {
            "mapId": "123456789012345678901234",
            "mapUser": "1",
            "mapImage": {
                "imageId": "1",
                "imageUser": "1",
                "imageName": "603516a6071dc137f8bcdf86.jpg",
                "imagePath": parkMap,
                "imagePathThumbnail": "path.jpg",
                "imageCreatedAt": "2021-02-23T14:52:22.842Z",
                "imageUpdatedAt": "2021-02-23T14:52:22.842Z"
            },
            "mapTitle": "My first map",
            "mapDescription": "",
            "mapPitchedBookingEnabled": true,
            "mapPitchedBookingURL": "https://test.com",
        }
    }).as('getMap')
    cy.route('https://interactive-map-api.herokuapp.com/public/maps/123456789012345678901234/keys', { 
        data: [{
            "mapKeyId": "1",
            "mapKeyUser": "1",
            "mapKeyMap": "1",
            "mapKeyTitle": "Touring Pitches",
            "mapKeyColor": "ff0000",
        }, {
            "mapKeyId": "2",
            "mapKeyUser": "1",
            "mapKeyMap": "1",
            "mapKeyTitle": "Caravans",
            "mapKeyColor": "00ff00",
        }]
    }).as('getKeys');
    cy.route('https://interactive-map-api.herokuapp.com/public/maps/123456789012345678901234/markers', { 
        data: [{
            "mapMarkerId": "1",
            "mapMarkerUser": "1",
            "mapMarkerMap": "1",
            "mapMarkerKey": "1",
            "mapMarkerOrder": 3,
            "mapMarkerName": "name",
            "mapMarkerPositionX": 10,
            "mapMarkerPositionY": 10,
            "mapMarkerTitle": "title",
            "mapMarkerTitleDisplayType": "hover",
            "mapMarkerButtonEnabled": true,
            "mapMarkerButtonLabel": "Find out more",
            "mapMarkerDescription": "description",
        }]
    }).as('getMarkers')
    cy.visit("/123456789012345678901234"); 
    cy.wait(['@getMap', '@getKeys', '@getMarkers'])
});

describe('Map Page Test', () => {

	it("Shows loader with map title", () => {
        cy.get('.map-page-loader').should('exist');
        cy.get('.map-page-loader-map-title').contains('My first map');
        cy.wait(300);
    });
        
    it("Opens keys pop up and makes sure checkboxes exist", () => {
        cy.wait(300);
        cy.get('.map-page-open-key-btn').trigger('click');
        cy.wait(300);
        cy.get('.map-page-key-mobile').should('exist');
        cy.get('.map-page-key-mobile .lucid-checkbox').eq(0).should('exist');
        cy.get('.map-page-key-mobile .lucid-checkbox').eq(1).should('exist');
        cy.wait(300);
        cy.get('.map-page-key-mobile .lucid-modal-close-btn').trigger('click');
        cy.wait(300);
    });

    it("Closes keys popup when close button is pressed", () => {
        cy.wait(300);
        cy.get('.map-page-open-key-btn').trigger('click');
        cy.wait(300);
        cy.get('.map-page-key-mobile .lucid-modal-close-btn').trigger('click');
        cy.wait(300);
        cy.get('.map-page-key-mobile').should('not.exist');
        cy.wait(300);
    });

    it("Opens booking widget popup and checks correct fields exist", () => {
        cy.wait(300);
        cy.get('.map-page-open-widget-btn').trigger('click');
        cy.wait(300);
        cy.get('.map-page-booking-widget-popup').should('exist');
        cy.get('.map-page-booking-widget-popup .holiday-type-select').should('exist');
        cy.get('.map-page-booking-widget-popup .arrival-date-select').should('exist');
        cy.get('.map-page-booking-widget-popup .duration-select').should('exist');
        cy.get('.map-page-booking-widget-popup .party-size-select').should('exist');
        cy.wait(300);
        cy.get('.map-page-booking-widget-popup .lucid-modal-close-btn').trigger('click');
        cy.wait(300);
    });

    it("Shows error messages when booking widget fields are filled in incorrectly", () => {
        cy.wait(300);
        cy.get('.map-page-open-widget-btn').trigger('click');
        cy.wait(300);
        cy.get('.map-page-booking-widget-popup').should('exist');
        cy.wait(300);
        cy.get('.pitched-widget-search-btn').trigger('click');
        cy.get('.map-page-booking-widget-popup .invalid-feedback').eq(0).should('have.text', 'Please select an arrival date');
        cy.get('.map-page-booking-widget-popup .invalid-feedback').eq(1).should('have.text', 'Please select a duration');
        cy.get('.map-page-booking-widget-popup .invalid-feedback').eq(2).should('have.text', 'Please select your party size');
        cy.wait(300);
        cy.get('.map-page-booking-widget-popup .lucid-modal-close-btn').trigger('click');
        cy.wait(300);
    });

    it("Closes booking widget popup when close button is pressed", () => {
        cy.wait(300);
        cy.get('.map-page-open-widget-btn').trigger('click');
        cy.wait(300);
        cy.get('.map-page-booking-widget-popup .lucid-modal-close-btn').trigger('click');
        cy.wait(300);
        cy.get('.map-page-booking-widget-popup').should('not.exist');
        cy.wait(300);
    });
    
    it("Clears the booking widget when the clear button is pressed", () => {
        cy.wait(300);
        cy.get('.map-page-open-widget-btn').trigger('click');
        cy.wait(300);
        cy.get('.map-page-booking-widget-popup').should('exist');
        cy.wait(300);
        cy.get('.map-page-booking-widget-popup .holiday-type-select').select('all', {force: true});
        cy.get('.map-page-booking-widget-popup .duration-select').select('7')
        cy.get('.map-page-booking-widget-popup .party-size-select').select('5');
        cy.wait(300);
        cy.get('.pitched-widget-clear-btn').trigger('click');
        cy.wait(300);
        cy.get('.map-page-open-widget-btn').trigger('click');
        cy.wait(300);
        cy.get('.map-page-booking-widget-popup .holiday-type-select').find(':selected').contains(/Holiday Type|All/g);
        cy.get('.map-page-booking-widget-popup .duration-select').find(':selected').contains('Holiday Duration');
        cy.get('.map-page-booking-widget-popup .party-size-select').find(':selected').contains('Party Size');
        cy.wait(300);
        cy.get('.map-page-booking-widget-popup .lucid-modal-close-btn').trigger('click');
        cy.wait(300);
    });

});