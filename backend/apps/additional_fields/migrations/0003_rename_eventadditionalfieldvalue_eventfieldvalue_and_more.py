# Generated by Django 4.2 on 2025-01-24 15:59

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("events", "0004_delete_eventlog"),
        ("additional_fields", "0002_eventadditionalfieldvalue_and_more"),
    ]

    operations = [
        migrations.RenameModel(
            old_name="EventAdditionalFieldValue",
            new_name="EventFieldValue",
        ),
        migrations.RemoveConstraint(
            model_name="eventfieldvalue",
            name="unique_event_add_field",
        ),
        migrations.AddConstraint(
            model_name="eventfieldvalue",
            constraint=models.UniqueConstraint(
                fields=("event", "add_field"), name="unique_event_field"
            ),
        ),
    ]
