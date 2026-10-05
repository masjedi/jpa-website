<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTeamMemberRequest;
use App\Http\Requests\Admin\UpdateTeamMemberRequest;
use App\Models\TeamMember;
use App\Support\Media\MediaValidationException;
use App\Support\Media\TeamAvatarImage;
use App\Support\Team\TeamMemberAttributes;
use App\Support\Team\TeamMemberPresenter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TeamsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/Teams', TeamMemberPresenter::forAdminIndex());
    }

    public function store(StoreTeamMemberRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        try {
            DB::transaction(function () use ($validated, $request): void {
                $avatar = app(TeamAvatarImage::class)->store($request->file('avatar_image'));
                $nextSortOrder = ((int) TeamMember::query()->max('sort_order')) + 1;

                TeamMember::query()->create(array_merge(
                    TeamMemberAttributes::fromValidated($validated),
                    [
                        'avatar_media' => $avatar->toArray(),
                        'sort_order' => $nextSortOrder,
                    ],
                ));
            });
        } catch (MediaValidationException $exception) {
            return back()
                ->withErrors(['avatar_image' => $exception->getMessage()])
                ->withInput();
        }

        return redirect()
            ->route('admin.teams.index')
            ->with('success', 'Team member created.');
    }

    public function update(UpdateTeamMemberRequest $request, TeamMember $teamMember): RedirectResponse
    {
        $validated = $request->validated();

        try {
            DB::transaction(function () use ($validated, $request, $teamMember): void {
                $attributes = TeamMemberAttributes::fromValidated($validated);

                if ($request->hasFile('avatar_image')) {
                    $existing = $teamMember->avatarAsset();
                    $avatar = app(TeamAvatarImage::class)->replace(
                        $request->file('avatar_image'),
                        $existing,
                    );
                    $attributes['avatar_media'] = $avatar->toArray();
                }

                $teamMember->update($attributes);
            });
        } catch (MediaValidationException $exception) {
            return back()
                ->withErrors(['avatar_image' => $exception->getMessage()])
                ->withInput();
        }

        return redirect()
            ->route('admin.teams.index')
            ->with('success', 'Team member updated.');
    }

    public function destroy(TeamMember $teamMember): RedirectResponse
    {
        DB::transaction(function () use ($teamMember): void {
            $avatar = $teamMember->avatarAsset();

            if ($avatar !== null) {
                app(TeamAvatarImage::class)->delete($avatar);
            }

            $teamMember->delete();
        });

        return redirect()
            ->route('admin.teams.index')
            ->with('success', 'Team member removed.');
    }
}
