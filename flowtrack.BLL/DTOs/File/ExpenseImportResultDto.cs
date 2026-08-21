namespace flowtrack.BLL.DTOs.File;
public record ExpenseImportResultDto
{
    public int TotalRows {get;init;}
    public int SuccessCount {get;init;}
    public int ErrorCount {get;init;}
    public IEnumerable<ExpenseImportRowResultDto> RowResults {get;init;} = [];
}