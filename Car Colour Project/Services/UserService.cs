using Car_Colour_Project.Models;
using Car_Colour_Project.Repository;

namespace Car_Colour_Project.Services;

public sealed class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public Task<IReadOnlyList<User>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return _userRepository.GetAllAsync(cancellationToken);
    }

    public Task<IReadOnlyList<User>> SearchAsync(string term, CancellationToken cancellationToken = default)
    {
        return _userRepository.SearchAsync(term, cancellationToken);
    }

    public Task<User?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        return _userRepository.GetByIdAsync(id, cancellationToken);
    }

    public Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return _userRepository.GetByEmailAsync(email, cancellationToken);
    }

    public Task<User> AddAsync(User user, CancellationToken cancellationToken = default)
    {
        return _userRepository.AddAsync(user, cancellationToken);
    }

    public Task<User?> UpdateAsync(User user, CancellationToken cancellationToken = default)
    {
        return _userRepository.UpdateAsync(user, cancellationToken);
    }

    public Task<User?> DeleteAsync(string id, CancellationToken cancellationToken = default)
    {
        return _userRepository.DeleteAsync(id, cancellationToken);
    }
}
