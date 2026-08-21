using flowtrack.BLL.DTOs.Budget;

namespace flowtrack.BLL.Interfaces;
public interface IBudgetStatusService
{
    Task<BudgetStatusDto> GetStatusAsync (Guid userId,Guid id);
    Task<IEnumerable<BudgetStatusDto>> GetStatusByPeriodAsync (Guid userId,int month,int year); 

}