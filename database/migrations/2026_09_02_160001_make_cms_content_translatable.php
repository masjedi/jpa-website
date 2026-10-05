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
        $this->migrateScalarColumns('articles', [
            'title' => 'string',
            'summary' => 'string',
            'content' => 'text',
        ]);

        $this->migrateScalarColumns('faq_items', [
            'question' => 'string',
            'answer' => 'text',
        ]);

        $this->migrateScalarColumns('testimonials', [
            'name' => 'string',
            'journey' => 'string',
            'text' => 'text',
        ]);

        $this->migrateScalarColumns('team_members', [
            'name' => 'string',
            'role' => 'string',
            'bio' => 'text',
        ]);

        $this->migrateScalarColumns('gallery_photos', [
            'alt' => 'string',
            'caption' => 'string',
        ]);

        $this->migrateScalarColumns('service_offerings', [
            'title' => 'string',
            'tagline' => 'string',
            'description' => 'text',
        ]);
        $this->migrateJsonListColumns('service_offerings', ['features']);

        $this->migrateScalarColumns('destinations', [
            'name' => 'string',
            'tagline' => 'string',
            'description' => 'text',
            'badge' => 'string',
            'best_season' => 'string',
            'travel_style' => 'string',
        ]);
        $this->migrateJsonListColumns('destinations', ['highlights', 'practical_notes']);

        $this->migrateScalarColumns('about_pages', [
            'intro_eyebrow' => 'string',
            'intro_title' => 'string',
            'intro_description' => 'text',
            'mission_section_eyebrow' => 'string',
            'mission_section_title' => 'string',
            'mission_title' => 'string',
            'mission_description' => 'text',
            'vision_title' => 'string',
            'vision_description' => 'text',
            'cta_eyebrow' => 'string',
            'cta_title' => 'string',
            'cta_description' => 'text',
            'cta_primary_label' => 'string',
            'cta_secondary_label' => 'string',
        ]);

        $this->migrateScalarColumns('about_journey_steps', [
            'title' => 'string',
            'description' => 'text',
            'image_alt' => 'string',
        ]);

        $this->migrateScalarColumns('site_settings', [
            'brand_name' => 'string',
            'office_location' => 'string',
            'whatsapp_display' => 'string',
        ]);

        $this->migrateTourFilterOptions();

        $this->migrateScalarColumns('tours', [
            'title' => 'string',
            'tagline' => 'string',
            'summary' => 'text',
            'destination' => 'string',
            'badge' => 'string',
            'content' => 'text',
            'duration_label' => 'string',
            'season' => 'string',
            'best_months' => 'string',
            'group_size' => 'string',
            'estimated_starting_price' => 'string',
            'price_estimate' => 'string',
            'ideal_for' => 'string',
            'next_departure_date' => 'string',
            'next_departure_status' => 'string',
        ]);
        $this->migrateJsonListColumns('tours', [
            'highlights',
            'inclusions',
            'key_destinations',
            'included_services',
            'itinerary_overview',
            'journey_outline',
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $this->rollbackJsonListColumns('tours', [
            'highlights',
            'inclusions',
            'key_destinations',
            'included_services',
            'itinerary_overview',
            'journey_outline',
        ]);
        $this->rollbackScalarColumns('tours', [
            'title' => 'string',
            'tagline' => 'string',
            'summary' => 'text',
            'destination' => 'string',
            'badge' => 'string',
            'content' => 'text',
            'duration_label' => 'string',
            'season' => 'string',
            'best_months' => 'string',
            'group_size' => 'string',
            'estimated_starting_price' => 'string',
            'price_estimate' => 'string',
            'ideal_for' => 'string',
            'next_departure_date' => 'string',
            'next_departure_status' => 'string',
        ]);

        $this->rollbackTourFilterOptions();

        $this->rollbackScalarColumns('site_settings', [
            'brand_name' => 'string',
            'office_location' => 'string',
            'whatsapp_display' => 'string',
        ]);

        $this->rollbackScalarColumns('about_journey_steps', [
            'title' => 'string',
            'description' => 'text',
            'image_alt' => 'string',
        ]);

        $this->rollbackScalarColumns('about_pages', [
            'intro_eyebrow' => 'string',
            'intro_title' => 'string',
            'intro_description' => 'text',
            'mission_section_eyebrow' => 'string',
            'mission_section_title' => 'string',
            'mission_title' => 'string',
            'mission_description' => 'text',
            'vision_title' => 'string',
            'vision_description' => 'text',
            'cta_eyebrow' => 'string',
            'cta_title' => 'string',
            'cta_description' => 'text',
            'cta_primary_label' => 'string',
            'cta_secondary_label' => 'string',
        ]);

        $this->rollbackJsonListColumns('destinations', ['highlights', 'practical_notes']);
        $this->rollbackScalarColumns('destinations', [
            'name' => 'string',
            'tagline' => 'string',
            'description' => 'text',
            'badge' => 'string',
            'best_season' => 'string',
            'travel_style' => 'string',
        ]);

        $this->rollbackJsonListColumns('service_offerings', ['features']);
        $this->rollbackScalarColumns('service_offerings', [
            'title' => 'string',
            'tagline' => 'string',
            'description' => 'text',
        ]);

        $this->rollbackScalarColumns('gallery_photos', [
            'alt' => 'string',
            'caption' => 'string',
        ]);

        $this->rollbackScalarColumns('team_members', [
            'name' => 'string',
            'role' => 'string',
            'bio' => 'text',
        ]);

        $this->rollbackScalarColumns('testimonials', [
            'name' => 'string',
            'journey' => 'string',
            'text' => 'text',
        ]);

        $this->rollbackScalarColumns('faq_items', [
            'question' => 'string',
            'answer' => 'text',
        ]);

        $this->rollbackScalarColumns('articles', [
            'title' => 'string',
            'summary' => 'string',
            'content' => 'text',
        ]);
    }

    /**
     * @param  array<string, string>  $columns
     */
    private function migrateScalarColumns(string $table, array $columns): void
    {
        foreach (array_keys($columns) as $column) {
            Schema::table($table, function (Blueprint $blueprint) use ($column): void {
                $blueprint->renameColumn($column, "{$column}_legacy");
            });
        }

        Schema::table($table, function (Blueprint $blueprint) use ($columns): void {
            foreach ($columns as $column => $type) {
                $blueprint->json($column)->nullable();
            }
        });

        foreach (DB::table($table)->cursor() as $row) {
            $updates = [];

            foreach ($columns as $column => $type) {
                $legacy = (string) ($row->{"{$column}_legacy"} ?? '');
                $updates[$column] = json_encode([
                    'en' => $legacy,
                    'fa' => '',
                    'ps' => '',
                ], JSON_THROW_ON_ERROR);
            }

            DB::table($table)->where('id', $row->id)->update($updates);
        }

        Schema::table($table, function (Blueprint $blueprint) use ($columns): void {
            $blueprint->dropColumn(array_map(
                static fn (string $column): string => "{$column}_legacy",
                array_keys($columns),
            ));
        });
    }

    /**
     * @param  list<string>  $columns
     */
    private function migrateJsonListColumns(string $table, array $columns): void
    {
        foreach ($columns as $column) {
            Schema::table($table, function (Blueprint $blueprint) use ($column): void {
                $blueprint->renameColumn($column, "{$column}_legacy");
            });
        }

        Schema::table($table, function (Blueprint $blueprint) use ($columns): void {
            foreach ($columns as $column) {
                $blueprint->json($column)->nullable();
            }
        });

        foreach (DB::table($table)->cursor() as $row) {
            $updates = [];

            foreach ($columns as $column) {
                $decoded = json_decode((string) ($row->{"{$column}_legacy"} ?? '[]'), true);
                $english = is_array($decoded) ? $decoded : [];

                $updates[$column] = json_encode([
                    'en' => $english,
                    'fa' => [],
                    'ps' => [],
                ], JSON_THROW_ON_ERROR);
            }

            DB::table($table)->where('id', $row->id)->update($updates);
        }

        Schema::table($table, function (Blueprint $blueprint) use ($columns): void {
            $blueprint->dropColumn(array_map(
                static fn (string $column): string => "{$column}_legacy",
                $columns,
            ));
        });
    }

    private function migrateTourFilterOptions(): void
    {
        Schema::table('tour_filter_options', function (Blueprint $table): void {
            $table->dropUnique(['type', 'name']);
        });

        Schema::table('tour_filter_options', function (Blueprint $table): void {
            $table->string('value')->nullable()->after('type');
        });

        foreach (DB::table('tour_filter_options')->cursor() as $option) {
            DB::table('tour_filter_options')
                ->where('id', $option->id)
                ->update(['value' => (string) ($option->name ?? '')]);
        }

        Schema::table('tour_filter_options', function (Blueprint $table): void {
            $table->string('value')->nullable(false)->change();
            $table->renameColumn('name', 'name_legacy');
        });

        Schema::table('tour_filter_options', function (Blueprint $table): void {
            $table->json('name')->nullable();
        });

        foreach (DB::table('tour_filter_options')->cursor() as $option) {
            DB::table('tour_filter_options')
                ->where('id', $option->id)
                ->update([
                    'name' => json_encode([
                        'en' => (string) ($option->name_legacy ?? ''),
                        'fa' => '',
                        'ps' => '',
                    ], JSON_THROW_ON_ERROR),
                ]);
        }

        Schema::table('tour_filter_options', function (Blueprint $table): void {
            $table->dropColumn('name_legacy');
            $table->unique(['type', 'value']);
        });
    }

    /**
     * @param  array<string, string>  $columns
     */
    private function rollbackScalarColumns(string $table, array $columns): void
    {
        foreach (array_keys($columns) as $column) {
            Schema::table($table, function (Blueprint $blueprint) use ($column, $columns): void {
                $legacyColumn = "{$column}_legacy";
                $type = $columns[$column];

                if ($type === 'text') {
                    $blueprint->text($legacyColumn)->nullable();
                } else {
                    $blueprint->string($legacyColumn)->nullable();
                }
            });
        }

        foreach (DB::table($table)->cursor() as $row) {
            $updates = [];

            foreach ($columns as $column => $type) {
                $decoded = json_decode((string) ($row->{$column} ?? ''), true);
                $updates["{$column}_legacy"] = is_array($decoded)
                    ? (string) ($decoded['en'] ?? '')
                    : (string) ($row->{$column} ?? '');
            }

            DB::table($table)->where('id', $row->id)->update($updates);
        }

        Schema::table($table, function (Blueprint $blueprint) use ($columns): void {
            $blueprint->dropColumn(array_keys($columns));
        });

        foreach (array_keys($columns) as $column) {
            Schema::table($table, function (Blueprint $blueprint) use ($column): void {
                $blueprint->renameColumn("{$column}_legacy", $column);
            });
        }
    }

    /**
     * @param  list<string>  $columns
     */
    private function rollbackJsonListColumns(string $table, array $columns): void
    {
        foreach ($columns as $column) {
            Schema::table($table, function (Blueprint $blueprint) use ($column): void {
                $blueprint->json("{$column}_legacy")->nullable();
            });
        }

        foreach (DB::table($table)->cursor() as $row) {
            $updates = [];

            foreach ($columns as $column) {
                $decoded = json_decode((string) ($row->{$column} ?? ''), true);
                $english = is_array($decoded) ? ($decoded['en'] ?? []) : [];
                $updates["{$column}_legacy"] = json_encode(
                    is_array($english) ? $english : [],
                    JSON_THROW_ON_ERROR,
                );
            }

            DB::table($table)->where('id', $row->id)->update($updates);
        }

        Schema::table($table, function (Blueprint $blueprint) use ($columns): void {
            $blueprint->dropColumn($columns);
        });

        foreach ($columns as $column) {
            Schema::table($table, function (Blueprint $blueprint) use ($column): void {
                $blueprint->renameColumn("{$column}_legacy", $column);
            });
        }
    }

    private function rollbackTourFilterOptions(): void
    {
        Schema::table('tour_filter_options', function (Blueprint $table): void {
            $table->dropUnique(['type', 'value']);
            $table->string('name_legacy')->nullable();
        });

        foreach (DB::table('tour_filter_options')->cursor() as $option) {
            $decoded = json_decode((string) ($option->name ?? ''), true);

            DB::table('tour_filter_options')
                ->where('id', $option->id)
                ->update([
                    'name_legacy' => is_array($decoded)
                        ? (string) ($decoded['en'] ?? $option->value ?? '')
                        : (string) ($option->value ?? ''),
                ]);
        }

        Schema::table('tour_filter_options', function (Blueprint $table): void {
            $table->dropColumn('name');
            $table->dropColumn('value');
            $table->renameColumn('name_legacy', 'name');
            $table->unique(['type', 'name']);
        });
    }
};
