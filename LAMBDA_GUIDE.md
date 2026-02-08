# Lambda Setup Guide (S3 Delete → DB Sync)

This guide shows how to set up a Lambda that updates your database when a file is deleted from S3, so the frontend no longer shows the file.

---

## Why This Lambda?
If someone deletes a file directly in S3, the DB still has the row.  
Result: the UI still shows the file, and opening it returns `NoSuchKey`.

Lambda fixes this by syncing the DB when S3 objects are removed.

---

## 1) Create Lambda
1. AWS Console → Lambda → **Create function**
2. Author from scratch
3. Runtime: **Python 3.12**
4. Function name: `SyncWithFileTrackerDB`

---

## 2) Add Environment Variables
Lambda → **Configuration → Environment variables**

```
DB_HOST=filetracker.cwho2ig06xxa.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=filetracker
DB_USER=Sudiptadb
DB_PASSWORD=<your_rds_password>
```

---

## 3) Add psycopg2 Layer
Lambda needs psycopg2 to connect to Postgres.

Add the layer ARN you published, for example:
```
arn:aws:lambda:us-east-1:646770357104:layer:psycopg2:1
```

Lambda → **Configuration → Layers → Add a layer**

---

## 4) Put Lambda in the RDS VPC
Lambda → **Configuration → VPC**

- VPC: same VPC as RDS
- Subnets: choose 2 subnets from the RDS subnet group
- Security group: **lambda-filetracker**

### RDS Security Group
Add inbound rule:
- Type: PostgreSQL
- Port: 5432
- Source: **lambda-filetracker**

---

## 5) Add S3 Trigger
Lambda → **Configuration → Triggers → Add trigger**

- Source: **S3**
- Bucket: `filestackerstorage`
- Event type: **Object Removed (All)**
- Prefix: leave empty (optional)
- Suffix: leave empty (optional)

---

## 6) Lambda Code (Example)
Use a handler named `lambda_handler`:

```python
import os
import psycopg2
import urllib.parse

def lambda_handler(event, context):
    conn = psycopg2.connect(
        host=os.environ["DB_HOST"],
        port=os.environ["DB_PORT"],
        dbname=os.environ["DB_NAME"],
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"],
    )
    cur = conn.cursor()

    for record in event.get("Records", []):
        key = record["s3"]["object"]["key"]
        key = urllib.parse.unquote_plus(key)

        cur.execute(
            "UPDATE file_data SET is_deleted = true WHERE storage_path = %s",
            (key,),
        )

    conn.commit()
    cur.close()
    conn.close()

    return {"statusCode": 200}
```

---

## 7) Test
1. Delete a file from S3
2. Check Lambda logs (CloudWatch)
3. Verify DB:
```sql
SELECT * FROM file_data WHERE storage_path LIKE '%<key>%';
```
`is_deleted` should be `true`

---

## 8) Common Issues
### Timeout
Cause: Lambda cannot reach RDS.  
Fix:
- Lambda in same VPC
- RDS SG allows Lambda SG

### Handler not found
Make sure the function is named:
```
def lambda_handler(event, context):
```

### Still showing in UI
Backend must filter:
```
WHERE is_deleted = false
```
