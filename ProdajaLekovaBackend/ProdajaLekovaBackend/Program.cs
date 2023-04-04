using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProdajaLekovaBackend.Configurations;
using ProdajaLekovaBackend.Models;
using ProdajaLekovaBackend.Repositories.Implementations;
using ProdajaLekovaBackend.Repositories.Interfaces;
using System.Reflection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ProdajaLekovaBackend.Services;

var builder = WebApplication.CreateBuilder(args);

//DbContext
builder.Services.AddDbContext<ApotekaDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration
            .GetConnectionString("DefaultConnection")));

// JWT token authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var jwtSection = builder.Configuration.GetSection("Jwt");
        var issuer = jwtSection.GetValue<string>("Issuer");
        var key = Environment.GetEnvironmentVariable("KEY", EnvironmentVariableTarget.Machine);

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = issuer,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
        };
    });

//AutoMapper
builder.Services.AddAutoMapper(typeof(MapperInitializer));

//Interfeces
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IAuthManager, AuthManager>();

//Controllers and ValidationContext
builder.Services.AddControllers().AddNewtonsoftJson(options =>
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore)
    .AddXmlDataContractSerializerFormatters()
    .ConfigureApiBehaviorOptions(setupAction =>
    {
        setupAction.InvalidModelStateResponseFactory = context =>
        {
            ProblemDetailsFactory problemDetailsFactory = context.HttpContext.RequestServices
                .GetRequiredService<ProblemDetailsFactory>();

            ValidationProblemDetails problemDetails = problemDetailsFactory.CreateValidationProblemDetails(
                context.HttpContext,
                context.ModelState);

            problemDetails.Detail = "Pogledajte polje errors za detalje.";
            problemDetails.Instance = context.HttpContext.Request.Path;

            var actionExecutiongContext = context as ActionExecutingContext;

            if ((context.ModelState.ErrorCount > 0) &&
                (actionExecutiongContext?.ActionArguments.Count == context.ActionDescriptor.Parameters.Count))
            {
                problemDetails.Status = StatusCodes.Status422UnprocessableEntity;
                problemDetails.Title = "Došlo je do greške prilikom validacije.";

                return new UnprocessableEntityObjectResult(problemDetails)
                {
                    ContentTypes = { "application/problem+json" }
                };
            }

            problemDetails.Status = StatusCodes.Status400BadRequest;
            problemDetails.Title = "Došlo je do greške prilikom parsiranja poslatog sadržaja.";
            return new BadRequestObjectResult(problemDetails)
            {
                ContentTypes = { "application/problem+json" }
            };
        };
    });

builder.Services.AddEndpointsApiExplorer();

//Swagger
builder.Services.AddSwaggerGen(setupAction =>
{
    setupAction.SwaggerDoc("ProdajaLekovaOpenApiSpecification",
            new Microsoft.OpenApi.Models.OpenApiInfo()
            {
                Title = "Prodaja lekova - Web shop",
                Version = "1",
                Description = "Pomoću ovog API-ja mogu se vrsiti sve navedene CRUD operacije vezane za entitete u okviru web shop-a koji se bavi prodajom lekova, vitamina, suplemenata, kozmetike i medicinske opreme.",
                Contact = new Microsoft.OpenApi.Models.OpenApiContact
                {
                    Name = "Maja Jukić",
                    Email = "mjukic2000@gmail.com",
                    Url = new Uri("https://github.com/majajukic")
                }
            });

    var xmlComments = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlCommentsPath = Path.Combine(AppContext.BaseDirectory, xmlComments);
    setupAction.IncludeXmlComments(xmlCommentsPath);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/ProdajaLekovaOpenApiSpecification/swagger.json", "ProdajaLekovaBackend");
        c.RoutePrefix = String.Empty;
    });
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
