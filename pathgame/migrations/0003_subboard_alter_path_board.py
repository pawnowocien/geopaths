# Generated by Django 5.2 on 2025-05-16 20:07

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pathgame', '0002_board_creator'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='SubBoard',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('board', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='subboards', to='pathgame.board')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='subboards', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AlterField(
            model_name='path',
            name='board',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pathgame.subboard'),
        ),
    ]
