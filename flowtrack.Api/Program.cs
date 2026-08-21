using flowtrack.Api.Extensions;
using flowtrack.BLL;
using flowtrack.DAL;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDataAccessLayer(builder.Configuration);
builder.Services.AddBusinessLogicLayer();


builder.Services.AddControllers();
//dependecias de Jwt
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddFrontendCors();
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}
app.UseGlobalExceptionHandling();

app.UseHttpsRedirection();

app.UseCors(CorsExtension.PolicyName);
app.UseAuthorization();

app.MapControllers();

app.Run();
