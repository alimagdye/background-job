# background-job

An API whose slow work happens in a background job — the endpoint answers instantly, a status endpoint reports progress, and one cron job runs on the clock alone.

Invalid input is rejected at the API boundary without creating a job, while valid jobs that fail because of temporary problems are retried automatically.
