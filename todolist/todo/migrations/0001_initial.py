# Generated by Django 4.1.6 on 2023-02-13 10:41

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Todo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('checkstate', models.BooleanField(default=False)),
                ('taskname', models.CharField(max_length=200)),
            ],
        ),
    ]