from django import forms
from .models import Assignment, Submission, Mark, User
import json


class AssignmentCreateForm(forms.ModelForm):
    rubric = forms.FileField(required=True)
    assignment_file = forms.FileField(required=True)
    mark_criteria = forms.CharField(widget=forms.HiddenInput())

    class Meta:
        model = Assignment
        fields = ["name", "creation_date", "due_date", "rubric", "assignment_file", "mark_criteria"]

    def save(self, administrator, submissions_data, *args, **kwargs):
        # 1. Save assignment
        assignment = super().save(commit=False)
        assignment.administrator = administrator
        assignment.mark_criteria = json.loads(self.cleaned_data["mark_criteria"])
        assignment.save()

        # 2. Create submissions
        for sub in submissions_data:
            submission = Submission.objects.create(
                name=sub["name"],
                submission_file=sub["submission_file"],
                comment=sub.get("comment", ""),
                admin_marks=json.loads(sub["admin_marks"]),
                assignment=assignment,
            )

            # 3. Create Mark objects for all markers
            markers = User.objects.filter(role="marker")
            for marker in markers:
                Mark.objects.create(
                    marks={},  # markers will fill this later
                    is_finalized=False,
                    marker=marker,
                    submission=submission,
                )

        return assignment
