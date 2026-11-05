using flowtrack.Api.Extensions;
using flowtrack.BLL;
using flowtrack.DAL;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Archivo .env local (opcional). Tiene menor precedencia que las variables de entorno
// del sistema y mayor que appsettings.json. Ver flowtrack.Api/.env.example.
builder.Configuration.AddEnvFile();

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

// En desarrollo la API se sirve también por HTTP (http://localhost:5106) para no depender
// del certificado de desarrollo. Fuera de desarrollo se mantiene la redirección a HTTPS.
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors(CorsExtension.PolicyName);
app.UseAuthorization();

app.MapControllers();

app.Run();
