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
    $routes->post('register', 'AuthController::register');
    $routes->get('plans', 'SubscriptionController::getPlans');

    // Protected Admin Routes
    $routes->group('admin', ['filter' => 'auth'], function ($routes) {
        $routes->get('subscription', 'UserSubscriptionController::getActiveSubscription');
        $routes->post('plans', 'SubscriptionController::savePlan');
        $routes->delete('plans/(:num)', 'SubscriptionController::deletePlan/$1');
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

        // Users Management (Super Admin only checks within controller)
        $routes->get('vendors', 'Admin\UserController::getVendors');
        $routes->get('vendors/(:num)', 'Admin\UserController::show/$1');
        $routes->post('vendors', 'Admin\UserController::create');
        $routes->post('vendors/(:num)/status', 'Admin\UserController::updateStatus/$1');
        $routes->post('vendors/(:num)/subscription', 'Admin\UserController::updateSubscription/$1');
        $routes->resource('users', ['controller' => 'Admin\UserController']);

        // Platform Administration
        $routes->get('payments', 'Admin\PaymentsController::index');
        $routes->get('payments/stats', 'Admin\PaymentsController::dashboardStats');
        $routes->get('payments/trends', 'Admin\PaymentsController::getTrendData');
        $routes->get('system-config', 'Admin\SystemConfigController::index');
        $routes->post('system-config', 'Admin\SystemConfigController::update');
        $routes->get('audit-logs', 'Admin\AuditLogController::index');
        $routes->get('registration-stats', 'Admin\UserController::getRegistrationStats');

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

        // AI Suggestions
        $routes->get('ai/settings', 'AIController::getSettings');
        $routes->post('ai/settings', 'AIController::updateSettings');
        $routes->post('ai/suggest', 'AIController::suggest');

        // Planet Relations (Compatibility Matrix)
        $routes->get('planet-relations', 'PlanetRelationController::index');
        $routes->post('planet-relations', 'PlanetRelationController::save');
        $routes->delete('planet-relations/(:num)', 'PlanetRelationController::delete/$1');

        // Vowel/Consonant Rules
        $routes->get('vowel-consonant-rules', 'VowelConsonantRuleController::index');
        $routes->post('vowel-consonant-rules', 'VowelConsonantRuleController::save');
        $routes->delete('vowel-consonant-rules/(:num)', 'VowelConsonantRuleController::delete/$1');

        // Business Lucky Numbers (Sectors)
        $routes->get('business-lucky-numbers', 'BusinessLuckyNumberController::index');
        $routes->post('business-lucky-numbers', 'BusinessLuckyNumberController::save');
        $routes->delete('business-lucky-numbers/(:num)', 'BusinessLuckyNumberController::delete/$1');

        // Lucky Name Numbers
        $routes->get('lucky-name-numbers', 'Admin\LuckyNameNumberController::index');
        $routes->post('lucky-name-numbers', 'Admin\LuckyNameNumberController::save');
        $routes->delete('lucky-name-numbers/(:num)', 'Admin\LuckyNameNumberController::delete/$1');

        // Lo Shu Grid & Kua
        $routes->get('lo-shu/meanings', 'Admin\LoShuController::listMeanings');
        $routes->post('lo-shu/meanings', 'Admin\LoShuController::saveMeaning');
        $routes->delete('lo-shu/meanings/(:num)', 'Admin\LoShuController::deleteMeaning/$1');
        $routes->get('lo-shu/kua', 'Admin\LoShuController::listKuaDetails');
        $routes->post('lo-shu/kua', 'Admin\LoShuController::saveKuaDetail');
        $routes->delete('lo-shu/kua/(:num)', 'Admin\LoShuController::deleteKuaDetail/$1');
        $routes->get('lo-shu/grid', 'Admin\LoShuGridController::index');
        $routes->post('lo-shu/grid', 'Admin\LoShuGridController::create');
        $routes->delete('lo-shu/grid/(:num)', 'Admin\LoShuGridController::delete/$1');
    });
});
