

sam local generate-event s3 \
            --bucket my-bucket \
            --key my-image.png \
                > event_payload.json

head -15 event_payload.json

sam local invoke MyFunction \
            --debug-port 6000 \
            -e event_payload.json