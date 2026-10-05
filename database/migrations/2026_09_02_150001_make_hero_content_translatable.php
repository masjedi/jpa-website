<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('hero_sections', function (Blueprint $table) {
            $table->renameColumn('eyebrow', 'eyebrow_legacy');
        });

        Schema::table('hero_sections', function (Blueprint $table) {
            $table->json('eyebrow')->nullable();
        });

        foreach (DB::table('hero_sections')->cursor() as $section) {
            DB::table('hero_sections')
                ->where('id', $section->id)
                ->update([
                    'eyebrow' => json_encode([
                        'en' => (string) ($section->eyebrow_legacy ?? ''),
                        'fa' => '',
                        'ps' => '',
                    ], JSON_THROW_ON_ERROR),
                ]);
        }

        Schema::table('hero_sections', function (Blueprint $table) {
            $table->dropColumn('eyebrow_legacy');
        });

        Schema::table('hero_slides', function (Blueprint $table) {
            $table->renameColumn('title', 'title_legacy');
            $table->renameColumn('subtitle', 'subtitle_legacy');
        });

        Schema::table('hero_slides', function (Blueprint $table) {
            $table->json('title')->nullable();
            $table->json('subtitle')->nullable();
        });

        foreach (DB::table('hero_slides')->cursor() as $slide) {
            DB::table('hero_slides')
                ->where('id', $slide->id)
                ->update([
                    'title' => json_encode([
                        'en' => (string) ($slide->title_legacy ?? ''),
                        'fa' => '',
                        'ps' => '',
                    ], JSON_THROW_ON_ERROR),
                    'subtitle' => json_encode([
                        'en' => (string) ($slide->subtitle_legacy ?? ''),
                        'fa' => '',
                        'ps' => '',
                    ], JSON_THROW_ON_ERROR),
                ]);
        }

        Schema::table('hero_slides', function (Blueprint $table) {
            $table->dropColumn(['title_legacy', 'subtitle_legacy']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hero_sections', function (Blueprint $table) {
            $table->string('eyebrow_legacy')->nullable();
        });

        foreach (DB::table('hero_sections')->cursor() as $section) {
            $decoded = json_decode((string) ($section->eyebrow ?? ''), true);
            $english = is_array($decoded) ? (string) ($decoded['en'] ?? '') : (string) ($section->eyebrow ?? '');

            DB::table('hero_sections')
                ->where('id', $section->id)
                ->update(['eyebrow_legacy' => $english]);
        }

        Schema::table('hero_sections', function (Blueprint $table) {
            $table->dropColumn('eyebrow');
            $table->renameColumn('eyebrow_legacy', 'eyebrow');
        });

        Schema::table('hero_slides', function (Blueprint $table) {
            $table->string('title_legacy')->nullable();
            $table->text('subtitle_legacy')->nullable();
        });

        foreach (DB::table('hero_slides')->cursor() as $slide) {
            $title = json_decode((string) ($slide->title ?? ''), true);
            $subtitle = json_decode((string) ($slide->subtitle ?? ''), true);

            DB::table('hero_slides')
                ->where('id', $slide->id)
                ->update([
                    'title_legacy' => is_array($title) ? (string) ($title['en'] ?? '') : (string) ($slide->title ?? ''),
                    'subtitle_legacy' => is_array($subtitle) ? (string) ($subtitle['en'] ?? '') : (string) ($slide->subtitle ?? ''),
                ]);
        }

        Schema::table('hero_slides', function (Blueprint $table) {
            $table->dropColumn(['title', 'subtitle']);
            $table->renameColumn('title_legacy', 'title');
            $table->renameColumn('subtitle_legacy', 'subtitle');
        });
    }
};
