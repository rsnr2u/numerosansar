<?php

namespace App\Controllers;

use App\Models\SystemConfigModel;
use CodeIgniter\API\ResponseTrait;

class PublicController extends BaseController
{
    use ResponseTrait;

    public function systemConfig()
    {
        // Allow CORS for public access
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($this->request->getMethod() === 'options') {
            return $this->response->setStatusCode(200);
        }

        $model = new SystemConfigModel();
        // Fetch specific configs that are safe for public consumption (branding, SEO, Maintenance)
        $publicKeys = [
            'platform_name', 'website_url', 'theme_color', 'cta_color', 'copyright_text',
            'seo_title', 'seo_keywords', 'seo_desc', 'maintenance_mode', 'maintenance_msg'
        ];
        
        $configs = $model->whereIn('config_key', $publicKeys)->findAll();
        
        return $this->respond($configs);
    }
}
