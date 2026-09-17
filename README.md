# background-job

An API whose slow work happens in a background job — the endpoint answers instantly, a status endpoint reports progress, and one cron job runs on the clock alone.

Invalid input is rejected at the API boundary without creating a job, while valid jobs that fail because of temporary problems are retried automatically.

### Cron examples

`0 8 * * *` runs the heartbeat every day at 08:00.

`0 22 * * 0` runs the heartbeat every Sunday at 22:00.

The five fields are:

minute hour day-of-month number-of-month day-of-week

So:

```
0 8 * * *
│ │
│ └── 08:00
└──── minute 0
```

and:

```
0 22 * * 0
│ │      │
│ │      └── Sunday
│ └───────── 22:00
└──────────── minute 0
```
