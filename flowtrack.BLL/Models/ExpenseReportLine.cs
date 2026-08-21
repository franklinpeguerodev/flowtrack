namespace flowtrack.BLL.Models;
public class ExpenseReportLine
{
    public DateTime Date {get;init;}
    public decimal Amount {get;init;}
    public string? Description {get;init;}
    public string CategoryName {get;init;} = string.Empty;
    public string PaymentMethodName {get;init;} = string.Empty;
}