pragma solidity ^0.5.0;
import "openzeppelin-solidity/contracts/math/SafeMath.sol";


contract Token{
    using SafeMath for uint;

    string public name="Mern Token";
    string public symbol="MERN";
    uint256 public decimals=18;
    uint256 public totalSupply;
    mapping(address=>uint256) public balanceOf;
    mapping(address=>mapping(address=>uint256)) public allowance;

    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);


    constructor() public {
        totalSupply = 1000000 * (10 ** decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);
        _transfer(msg.sender, _to, _value);
        return true;
    }

    //Defining Internal Function.
    function _transfer(address _from, address _to, uint256 _value) internal{

        require(_to != address(0));
        balanceOf[_from] = balanceOf[_from].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);
        emit Transfer(_from, _to, _value);
    }

    function approve(address _spender,uint256 _value) public returns(bool success){
        require(_spender != address(0));//checking address=0x0 is invalid.
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    
    function transferFrom(address _from,address _to, uint256 _value) public returns(bool success){
        require(balanceOf[_from] >= _value);
        require(allowance[_from][msg.sender] >= _value);
        _transfer(_from, _to, _value);
        allowance[_from][msg.sender]=allowance[_from][msg.sender].sub(_value);
        return true;
    }
}