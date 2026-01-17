<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->options('(:any)', function () {
    return service('response')->setStatusCode(200);
});

$routes->group('api', function ($routes) {
    $routes->post('calculate', 'NumerologyController::calculate');
    $routes->get('meanings/(:num)', 'NumerologyController::meanings/$1');
    $routes->post('login', 'AuthController::login');

    // Protected Admin Routes
    $routes->group('admin', ['filter' => 'auth'], function ($routes) {
        $routes->get('meanings', 'AdminController::listMeanings');
        $routes->post('meanings', 'AdminController::saveMeaning');
        $routes->delete('meanings/(:num)', 'AdminController::deleteMeaning/$1');
        $routes->get('planets', 'AdminController::listPlanets');
        $routes->get('letters', 'AdminController::listLetters');
        $routes->get('history', 'AdminController::getGlobalHistory');
        $routes->post('calculate', 'AdminController::calculateName');

        // Settings
        $routes->get('settings', 'AdminSettingsController::index');
        $routes->post('settings', 'AdminSettingsController::update');

        // Dashboard
        $routes->get('dashboard/stats', 'AdminController::getDashboardStats');

        // Profile
        $routes->get('profile', 'AdminProfileController::index');
        $routes->post('profile', 'AdminProfileController::update');
        $routes->post('change-password', 'AdminProfileController::changePassword');

        // Clients
        $routes->get('clients/(:num)/history', 'ClientController::getHistory/$1');
        $routes->resource('clients', ['controller' => 'ClientController']);

        // Planet Relations
        $routes->get('planet-relations', 'AdminPlanetRelationController::index');

        // Business Numerology
        $routes->post('business-numerology/check', 'BusinessNumerologyController::check');
        $routes->post('numerology/confirm', 'ClientController::confirmSelection');

        // Mobile Numerology
        $routes->post('mobile-numerology/check', 'MobileNumerologyController::check');
        $routes->delete('mobile-numerology/(:num)', 'MobileNumerologyController::delete/$1');
        $routes->put('mobile-numerology/(:num)', 'MobileNumerologyController::update/$1');

        // Vehicle Numerology
        $routes->post('vehicle-numerology/check', 'VehicleNumerologyController::check');
    });
});
