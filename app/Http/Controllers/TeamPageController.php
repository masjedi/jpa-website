<?php

namespace App\Http\Controllers;

use App\Support\Seo\SeoPresenter;
use App\Support\Team\TeamMemberPresenter;
use Inertia\Inertia;
use Inertia\Response;

class TeamPageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('public/OurTeam', [
            ...TeamMemberPresenter::forPublicTeamPage(),
            'seo' => SeoPresenter::page('team', '/about/team'),
        ]);
    }
}
