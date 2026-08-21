namespace flowtrack.BLL.DTOs.File;

public record ExpenseImportRowResultDto{
    public int RowNumber {get;init;}
    public bool Success {get;init;}
    public string? ErrorMessage {get;init;}
}